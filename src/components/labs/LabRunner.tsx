import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { labDefinitions } from "@/data/labDefinitions";
import { LabStep } from "./LabStep";

export function LabRunner() {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const lab = labDefinitions.find(l => l.id === labId);

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (lab) {
      const saved = localStorage.getItem(`lab-progress-${lab.id}`);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedSteps(data.completedSteps || []);
        setCurrentStep(data.currentStep || 0);
        setHintsUsed(data.hintsUsed || 0);
        setFinished(data.finished || false);
      } else {
        setCompletedSteps(new Array(lab.steps.length).fill(false));
      }
    }
  }, [lab]);

  useEffect(() => {
    if (lab && completedSteps.length > 0) {
      localStorage.setItem(`lab-progress-${lab.id}`, JSON.stringify({
        completedSteps, currentStep, hintsUsed, finished,
      }));
    }
  }, [completedSteps, currentStep, hintsUsed, finished, lab]);

  if (!lab) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Lab not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/labs')}>
          Back to Labs
        </Button>
      </div>
    );
  }

  const handleStepComplete = (stepIndex: number, usedHint: boolean) => {
    const next = [...completedSteps];
    next[stepIndex] = true;
    setCompletedSteps(next);
    if (usedHint) setHintsUsed(h => h + 1);

    if (stepIndex + 1 < lab.steps.length) {
      setCurrentStep(stepIndex + 1);
    } else {
      setFinished(true);
      // Save completion
      const completions = JSON.parse(localStorage.getItem('lab-completions') || '{}');
      const score = Math.max(0, 100 - (hintsUsed + (usedHint ? 1 : 0)) * 10);
      completions[lab.id] = { score, completedAt: new Date().toISOString() };
      localStorage.setItem('lab-completions', JSON.stringify(completions));
    }
  };

  const handleReset = () => {
    setCompletedSteps(new Array(lab.steps.length).fill(false));
    setCurrentStep(0);
    setHintsUsed(0);
    setFinished(false);
    localStorage.removeItem(`lab-progress-${lab.id}`);
    const completions = JSON.parse(localStorage.getItem('lab-completions') || '{}');
    delete completions[lab.id];
    localStorage.setItem('lab-completions', JSON.stringify(completions));
  };

  const progress = Math.round((completedSteps.filter(Boolean).length / lab.steps.length) * 100);
  const score = Math.max(0, 100 - hintsUsed * 10);

  const diffColor = lab.difficulty === 'Beginner' ? 'hsl(145, 60%, 40%)'
    : lab.difficulty === 'Intermediate' ? 'hsl(45, 90%, 45%)'
    : 'hsl(0, 70%, 50%)';

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/labs')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: diffColor, color: 'white' }}>
              {lab.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">Lab {lab.number} • ~{lab.estimatedMinutes} min</span>
          </div>
          <h1 className="text-lg font-bold text-foreground mt-1">{lab.title}</h1>
        </div>
        <Button variant="ghost" size="sm" className="text-xs" onClick={handleReset}>
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{lab.description}</p>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{completedSteps.filter(Boolean).length} / {lab.steps.length} steps</span>
          <span>Score: {score}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Finished state */}
      {finished && (
        <Card className="border-0 shadow-md" style={{ backgroundColor: 'hsl(145, 60%, 95%)' }}>
          <CardContent className="p-6 text-center space-y-3">
            <Trophy className="h-10 w-10 mx-auto" style={{ color: 'hsl(45, 90%, 45%)' }} />
            <h2 className="text-xl font-bold text-foreground">Lab Complete!</h2>
            <p className="text-sm text-muted-foreground">
              You scored <strong>{score}%</strong> — {hintsUsed === 0 ? 'Perfect! No hints used.' : `${hintsUsed} hint(s) used.`}
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/labs')}>Back to Labs</Button>
              <Button onClick={handleReset}>Retry Lab</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div className="space-y-2">
        {lab.steps.map((step, i) => (
          <LabStep
            key={i}
            step={step}
            stepIndex={i}
            totalSteps={lab.steps.length}
            isActive={i === currentStep && !finished}
            isCompleted={completedSteps[i] || false}
            onComplete={(usedHint) => handleStepComplete(i, usedHint)}
          />
        ))}
      </div>
    </div>
  );
}
