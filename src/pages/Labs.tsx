import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { labDefinitions, type Difficulty } from "@/data/labDefinitions";
import { Check, Clock, FlaskConical } from "lucide-react";

interface Completion {
  score: number;
  completedAt: string;
}

export default function Labs() {
  const navigate = useNavigate();
  const [completions, setCompletions] = useState<Record<string, Completion>>({});
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');

  useEffect(() => {
    const saved = localStorage.getItem('lab-completions');
    if (saved) setCompletions(JSON.parse(saved));
  }, []);

  const filtered = filter === 'All' ? labDefinitions : labDefinitions.filter(l => l.difficulty === filter);
  const totalCompleted = Object.keys(completions).length;

  const diffColors: Record<Difficulty, string> = {
    Beginner: 'hsl(145, 60%, 40%)',
    Intermediate: 'hsl(45, 90%, 45%)',
    Advanced: 'hsl(0, 70%, 50%)',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="h-5 w-5" style={{ color: 'hsl(199, 96%, 43%)' }} />
            Simulation Labs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCompleted} of {labDefinitions.length} labs completed — hands-on training with the Catalyst Center UI
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === d
                ? 'text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            style={filter === d ? { backgroundColor: d === 'All' ? 'hsl(199, 96%, 43%)' : diffColors[d as Difficulty] } : {}}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Lab grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(lab => {
          const completion = completions[lab.id];
          return (
            <Card
              key={lab.id}
              className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative"
              onClick={() => navigate(`/labs/${lab.id}`)}
            >
              {completion && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'hsl(145, 60%, 40%)', color: 'white' }}>
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">#{lab.number}</span>
                  <span
                    className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider"
                    style={{ backgroundColor: diffColors[lab.difficulty], color: 'white' }}
                  >
                    {lab.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-tight">{lab.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{lab.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> ~{lab.estimatedMinutes} min
                  </div>
                  <span className="text-xs text-muted-foreground">{lab.steps.length} steps</span>
                </div>
                {completion && (
                  <div className="text-[10px] font-medium" style={{ color: 'hsl(145, 60%, 40%)' }}>
                    Score: {completion.score}%
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
