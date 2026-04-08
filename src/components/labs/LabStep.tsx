import { useState } from "react";
import { Check, X, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LabStepDef } from "@/data/labDefinitions";

interface LabStepProps {
  step: LabStepDef;
  stepIndex: number;
  totalSteps: number;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: (usedHint: boolean) => void;
}

export function LabStep({ step, stepIndex, isActive, isCompleted, onComplete }: LabStepProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');
  const [hintUsed, setHintUsed] = useState(false);

  const handleShowHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  const validateAnswer = () => {
    const val = step.validation;
    const input = answer.trim().toLowerCase();

    if (val.type === 'choice') {
      onComplete(hintUsed);
      return;
    }
    if (val.type === 'navigation') {
      // Navigation steps auto-complete or user confirms
      onComplete(hintUsed);
      return;
    }
    if (val.type === 'exact') {
      if (input === (val.answer || '').toLowerCase()) {
        onComplete(hintUsed);
        return;
      }
    }
    if (val.type === 'contains') {
      const acceptList = val.acceptAny || (val.answer ? [val.answer] : []);
      if (acceptList.some(a => input.includes(a.toLowerCase()))) {
        onComplete(hintUsed);
        return;
      }
    }
    setError('Not quite — try again or use a hint.');
  };

  if (!isActive && !isCompleted) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 opacity-40">
        <div className="w-6 h-6 rounded-full border border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">
          {stepIndex + 1}
        </div>
        <span className="text-sm text-muted-foreground">{step.instruction}</span>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0" style={{ backgroundColor: 'hsl(145, 60%, 40%)', color: 'white' }}>
          <Check className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm text-muted-foreground line-through">{step.instruction}</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 rounded-lg border" style={{ borderColor: 'hsl(199, 96%, 43%)', backgroundColor: 'hsl(199, 96%, 43%, 0.05)' }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold" style={{ backgroundColor: 'hsl(199, 96%, 43%)', color: 'white' }}>
          {stepIndex + 1}
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-foreground">{step.instruction}</p>

          {step.validation.type === 'choice' && step.validation.choices && (
            <div className="flex flex-wrap gap-2">
              {step.validation.choices.map(choice => (
                <Button
                  key={choice}
                  size="sm"
                  variant={answer === choice ? 'default' : 'outline'}
                  className="text-xs"
                  onClick={() => { setAnswer(choice); setError(''); }}
                >
                  {choice}
                </Button>
              ))}
            </div>
          )}

          {(step.validation.type === 'exact' || step.validation.type === 'contains') && step.type !== 'navigate' && step.type !== 'action' && (
            <input
              type="text"
              value={answer}
              onChange={e => { setAnswer(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && validateAnswer()}
              placeholder="Type your answer..."
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive">
              <X className="h-3 w-3" /> {error}
            </div>
          )}

          {showHint && (
            <div className="flex items-start gap-2 text-xs p-2 rounded-md" style={{ backgroundColor: 'hsl(45, 90%, 50%, 0.1)', color: 'hsl(45, 80%, 30%)' }}>
              <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              {step.hint}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button size="sm" className="text-xs" onClick={validateAnswer}>
              {step.type === 'navigate' || step.type === 'action' ? 'Done' : 'Check Answer'}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
            {!showHint && (
              <Button size="sm" variant="ghost" className="text-xs text-muted-foreground" onClick={handleShowHint}>
                <Lightbulb className="h-3 w-3 mr-1" /> Hint
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
