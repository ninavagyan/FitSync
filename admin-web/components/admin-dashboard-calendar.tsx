"use client";

import { useMemo, useState } from "react";
import { getStatusBadgeClass } from "@/components/status-badge";
import type { Trainer, Training } from "@/lib/types";

type CalendarCell = {
  key: string;
  inMonth: boolean;
  isToday: boolean;
  dateNumber: number;
  dateLabel: string;
  trainings: Training[];
};

type CalendarData = {
  label: string;
  cells: CalendarCell[];
};

type TrainingFormState = {
  name: string;
  description: string;
  category: string;
  trainerId: string;
  startAt: string;
  endAt: string;
  capacity: string;
  status: string;
};

type Props = {
  calendar: CalendarData;
  trainers: Trainer[];
};

function toLocalDateTimeInput(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatCreateState(dateKey: string): TrainingFormState {
  return {
    name: "",
    description: "",
    category: "pilates",
    trainerId: "",
    startAt: `${dateKey}T09:00`,
    endAt: `${dateKey}T10:00`,
    capacity: "12",
    status: "scheduled",
  };
}

function formatEditState(training: Training): TrainingFormState {
  return {
    name: training.name,
    description: training.description ?? "",
    category: training.category,
    trainerId: training.trainerId ?? "",
    startAt: toLocalDateTimeInput(training.startAt),
    endAt: toLocalDateTimeInput(training.endAt),
    capacity: String(training.capacity),
    status: training.status,
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminDashboardCalendar({ calendar, trainers }: Props) {
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<TrainingFormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allTrainings = useMemo(() => calendar.cells.flatMap((cell) => cell.trainings), [calendar.cells]);
  const selectedTraining = selectedTrainingId ? allTrainings.find((item) => item.id === selectedTrainingId) ?? null : null;

  function closeModal() {
    setMode(null);
    setSelectedDateKey(null);
    setSelectedTrainingId(null);
    setFormState(null);
    setSubmitting(false);
    setError(null);
  }

  function openCreate(dateKey: string) {
    setMode("create");
    setSelectedDateKey(dateKey);
    setSelectedTrainingId(null);
    setFormState(formatCreateState(dateKey));
    setError(null);
  }

  function openEdit(training: Training) {
    setMode("edit");
    setSelectedDateKey(null);
    setSelectedTrainingId(training.id);
    setFormState(formatEditState(training));
    setError(null);
  }

  async function submitForm() {
    if (!formState) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      name: formState.name,
      description: formState.description,
      category: formState.category,
      trainerId: formState.trainerId || null,
      startAt: new Date(formState.startAt).toISOString(),
      endAt: new Date(formState.endAt).toISOString(),
      capacity: Number(formState.capacity),
      status: formState.status,
    };

    const response = await fetch(
      mode === "create" ? "/api/v1/admin/trainings" : `/api/v1/admin/trainings/${selectedTrainingId}`,
      {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Training save failed.");
      setSubmitting(false);
      return;
    }

    window.location.reload();
  }

  async function deleteTraining() {
    if (!selectedTrainingId) return;
    setSubmitting(true);
    setError(null);
    const response = await fetch(`/api/v1/admin/trainings/${selectedTrainingId}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error?.message ?? "Training removal failed.");
      setSubmitting(false);
      return;
    }
    window.location.reload();
  }

  return (
    <>
      <div className="calendar-grid admin-calendar-grid">
        {calendar.cells.map((cell) => (
          <article key={cell.key} className={`calendar-day admin-calendar-day ${cell.inMonth ? "" : "outside-month"} ${cell.isToday ? "today" : ""}`.trim()}>
            <div className="calendar-day-header admin-calendar-day-header">
              <div>
                <span className="calendar-day-number">{cell.dateNumber}</span>
                <span className="calendar-day-label">{cell.dateLabel}</span>
              </div>
              <button type="button" className="calendar-add-button" onClick={() => openCreate(cell.key)}>
                Add
              </button>
            </div>

            {cell.trainings.length === 0 ? (
              <p className="calendar-empty">No trainings</p>
            ) : (
              <div className="calendar-trainings">
                {cell.trainings.map((training) => (
                  <button key={training.id} type="button" className={`admin-calendar-training-button status-card status-${training.status}`.trim()} onClick={() => openEdit(training)}>
                    {training.name}
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {mode && formState ? (
        <div className="training-modal-backdrop" onClick={closeModal} role="presentation">
          <div className="training-modal admin-training-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="training-modal-header">
              <div>
                <span className="eyebrow">Admin training editor</span>
                <h3>{mode === "create" ? "Add training" : "Edit training"}</h3>
              </div>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Close dialog">
                Close
              </button>
            </div>

            {error ? <p className="badge danger">{error}</p> : null}

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label>Name</label><input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} /></div>
              <div className="field"><label>Category</label><select value={formState.category} onChange={(e) => setFormState({ ...formState, category: e.target.value })}><option value="pilates">Pilates</option><option value="yoga">Yoga</option><option value="group_training">Group training</option></select></div>
              <div className="field"><label>Trainer</label><select value={formState.trainerId} onChange={(e) => setFormState({ ...formState, trainerId: e.target.value })}><option value="">Unassigned</option>{trainers.map((trainer) => <option key={trainer.id} value={trainer.id}>{trainer.fullName}</option>)}</select></div>
              <div className="field"><label>Capacity</label><input type="number" min={1} value={formState.capacity} onChange={(e) => setFormState({ ...formState, capacity: e.target.value })} /></div>
              <div className="field"><label>Start</label><input type="datetime-local" value={formState.startAt} onChange={(e) => setFormState({ ...formState, startAt: e.target.value })} /></div>
              <div className="field"><label>End</label><input type="datetime-local" value={formState.endAt} onChange={(e) => setFormState({ ...formState, endAt: e.target.value })} /></div>
              <div className="field"><label>Status</label><select value={formState.status} onChange={(e) => setFormState({ ...formState, status: e.target.value })}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="full">Full</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select></div>
              <div className="field" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} /></div>
            </div>

            {mode === "edit" && selectedTraining ? (
              <div className="admin-modal-summary">
                <p className="training-detail">Current time: {formatTime(selectedTraining.startAt)} - {formatTime(selectedTraining.endAt)}</p>
                <p className="training-detail">Booked: {selectedTraining.bookedCount}/{selectedTraining.capacity}</p>
              </div>
            ) : null}

            <div className="training-actions modal-actions">
              <button type="button" className="button primary" onClick={submitForm} disabled={submitting}>
                {mode === "create" ? "Create training" : "Save changes"}
              </button>
              {mode === "edit" ? (
                <button type="button" className="button secondary" onClick={deleteTraining} disabled={submitting}>
                  Remove training
                </button>
              ) : null}
              <button type="button" className="button secondary" onClick={closeModal} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
