"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface DraggableQuizProps {
  questionId: number;
  question: string;
  correctAnswer: string;
  onAnswer: (answer: string) => void;
  isAnswerChecked: boolean;
  isCorrect: boolean;
}

function DraggableBall({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`${
        isDragging ? "opacity-50" : ""
      } cursor-grab active:cursor-grabbing`}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brightRed to-sunnyYellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sunnyYellow to-brightRed flex items-center justify-center">
          <div className="text-3xl">⚽</div>
        </div>
      </div>
    </motion.div>
  );
}

function DropZone({ id, label, isOver, children }: { id: string; label: string; isOver: boolean; children?: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`absolute transition-all ${
        isOver ? "ring-4 ring-limeGreen scale-110" : ""
      }`}
      style={{
        ...(id === "on" && { top: "-60px", left: "50%", transform: "translateX(-50%)" }),
        ...(id === "in" && { top: "40%", left: "50%", transform: "translate(-50%, -50%)" }),
        ...(id === "under" && { bottom: "-60px", left: "50%", transform: "translateX(-50%)" }),
        ...(id === "beside-left" && { top: "40%", left: "-80px", transform: "translateY(-50%)" }),
        ...(id === "beside-right" && { top: "40%", right: "-80px", transform: "translateY(-50%)" }),
        ...(id === "above" && { top: "-120px", left: "50%", transform: "translateX(-50%)" }),
      }}
    >
      {children}
      {!children && (
        <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-400 flex items-center justify-center bg-white/50">
          <span className="text-sm font-bold font-comic text-gray-600">{label}</span>
        </div>
      )}
    </div>
  );
}

export default function DraggableQuiz({
  questionId,
  question,
  correctAnswer,
  onAnswer,
  isAnswerChecked,
  isCorrect,
}: DraggableQuizProps) {
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [ballPosition, setBallPosition] = useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (over) {
      const dropZoneId = over.id as string;
      const answer = dropZoneId.startsWith("beside") ? "beside" : dropZoneId;
      setBallPosition(dropZoneId);
      onAnswer(answer);
    }
    setActiveDropZone(null);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragOver={(event) => setActiveDropZone(event.over?.id as string || null)}
    >
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-comic mb-4">
            {question}
          </h2>
          <p className="text-xl font-comic text-gray-600">
            Drag the ball to the correct position!
          </p>
        </motion.div>

        <div className="relative mx-auto" style={{ width: "500px", height: "500px" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-3xl border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              style={{ width: "300px", height: "200px" }}
            >
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 rounded-2xl border-4 border-yellow-800"
                style={{ width: "250px", height: "150px" }}
              />

              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-yellow-950/50 rounded-b-2xl" />

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-black rounded-full opacity-20 blur-sm" />
            </div>

            <DropZone id="on" label="On" isOver={activeDropZone === "on"}>
              {ballPosition === "on" && <DraggableBall id="ball" />}
            </DropZone>

            <DropZone id="in" label="In" isOver={activeDropZone === "in"}>
              {ballPosition === "in" && <DraggableBall id="ball" />}
            </DropZone>

            <DropZone id="under" label="Under" isOver={activeDropZone === "under"}>
              {ballPosition === "under" && <DraggableBall id="ball" />}
            </DropZone>

            <DropZone id="beside-left" label="Beside" isOver={activeDropZone === "beside-left"}>
              {ballPosition === "beside-left" && <DraggableBall id="ball" />}
            </DropZone>

            <DropZone id="beside-right" label="Beside" isOver={activeDropZone === "beside-right"}>
              {ballPosition === "beside-right" && <DraggableBall id="ball" />}
            </DropZone>

            <DropZone id="above" label="Above" isOver={activeDropZone === "above"}>
              {ballPosition === "above" && <DraggableBall id="ball" />}
            </DropZone>
          </div>

          {!ballPosition && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <DraggableBall id="ball" />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {isAnswerChecked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className={`p-6 rounded-2xl border-4 border-black text-center ${
                isCorrect
                  ? "bg-limeGreen text-white"
                  : "bg-brightRed text-white"
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                {isCorrect ? (
                  <Check className="w-12 h-12" />
                ) : (
                  <X className="w-12 h-12" />
                )}
                <h3 className="text-3xl font-bold font-comic">
                  {isCorrect ? "Correct! Amazing!" : "Oops! Try again!"}
                </h3>
              </div>
              <p className="text-xl font-comic">
                {isCorrect
                  ? "You're doing great! Keep it up!"
                  : `The correct answer is "${correctAnswer}". Don't worry, you'll get it!`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DndContext>
  );
}
