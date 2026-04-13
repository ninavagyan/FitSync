"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CustomerTraining } from "@/lib/types";

type CalendarCell = {
  key: string;
  dateNumber: number;
  dateLabel: string;
  inMonth: boolean;
  isToday: boolean;
  trainings: CustomerTraining[];
};

type CalendarMonth = {
  key: string;
  label: string;
  cells: CalendarCell[];
};

type Props = {
  month: CalendarMonth;
  activeMonthKey: string;
  userLoggedIn: boolean;
  loginRedirectHref: string;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatTimeRange(startAt: string, endAt: string) {
  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export function CustomerScheduleCalendar({ month, activeMonthKey, userLoggedIn, loginRedirectHref }: Props) {
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);

  const monthTrainings = useMemo(
    () => month.cells.flatMap((cell) => cell.trainings).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
    [month.cells],
  );

  const selectedIndex = useMemo(
    () => monthTrainings.findIndex((training) => training.id === selectedTrainingId),
    [monthTrainings, selectedTrainingId],
  );

  const selectedTraining = selectedIndex >= 0 ? monthTrainings[selectedIndex] : null;

  useEffect(() => {
    if (!selectedTrainingId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTrainingId(null);
      }
      if (event.key === "ArrowRight" && selectedIndex >= 0 && selectedIndex < monthTrainings.length - 1) {
        setSelectedTrainingId(monthTrainings[selectedIndex + 1].id);
      }
      if (event.key === "ArrowLeft" && selectedIndex > 0) {
        setSelectedTrainingId(monthTrainings[selectedIndex - 1].id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [monthTrainings, selectedIndex, selectedTrainingId]);

  const isExpired = selectedTraining ? new Date(selectedTraining.endAt).getTime() <= Date.now() : false;
  const isBookable = selectedTraining
    ? selectedTraining.status === "scheduled" && selectedTraining.bookedCount < selectedTraining.capacity && !isExpired && !selectedTraining.isUserBooked
    : false;
  const canCancel = selectedTraining
    ? selectedTraining.isUserBooked && selectedTraining.status !== "cancelled" && !isExpired
    : false;

  return (
    <>
      <div className="calendar-grid">
        {month.cells.map((cell) => (
          <article key={cell.key} className={`calendar-day ${cell.inMonth ? "" : "outside-month"} ${cell.isToday ? "today" : ""}`.trim()}>
            <div className="calendar-day-header">
              <span className="calendar-day-number">{cell.dateNumber}</span>
              <span className="calendar-day-label">{cell.dateLabel}</span>
            </div>

            {cell.trainings.length === 0 ? (
              <p className="calendar-empty">No trainings</p>
            ) : (
              <div className="calendar-trainings">
                {cell.trainings.map((training) => (
                  <button
                    key={training.id}
                    type="button"
                    className="calendar-training-button"
                    onClick={() => setSelectedTrainingId(training.id)}
                  >
                    <span className="calendar-training-time">{formatTimeRange(training.startAt, training.endAt)}</span>
                    <strong>{training.name}</strong>
                    <span className="calendar-training-seats">{training.bookedCount}/{training.capacity} seats</span>
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {selectedTraining ? (
        <div className="training-modal-backdrop" onClick={() => setSelectedTrainingId(null)} role="presentation">
          <div className="training-modal" role="dialog" aria-modal="true" aria-labelledby="training-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="training-modal-header">
              <div>
                <span className="eyebrow">Training details</span>
                <h3 id="training-modal-title">{selectedTraining.name}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setSelectedTrainingId(null)} aria-label="Close dialog">
                Close
              </button>
            </div>

            <div className="training-meta">
              <span className="badge neutral">{selectedTraining.category.replaceAll("_", " ")}</span>
              <span className={`badge ${selectedTraining.status === "full" ? "warning" : selectedTraining.status === "cancelled" ? "danger" : ""}`.trim()}>
                {selectedTraining.status}
              </span>
              {selectedTraining.isUserBooked ? <span className="badge">Booked</span> : null}
            </div>

            <p className="muted">{selectedTraining.description || "Studio training session"}</p>
            <p className="training-detail">Trainer: {selectedTraining.trainerName || "Assigned soon"}</p>
            <p className="training-detail">Starts: {formatLongDate(selectedTraining.startAt)}</p>
            <p className="training-detail">Ends: {formatLongDate(selectedTraining.endAt)}</p>
            <p className="training-detail">Seats: {selectedTraining.bookedCount}/{selectedTraining.capacity}</p>

            <div className="training-actions modal-actions">
              {userLoggedIn ? (
                selectedTraining.isUserBooked ? (
                  <form method="post" action={`/api/site/trainings/${selectedTraining.id}/cancel`}>
                    <input type="hidden" name="redirectTo" value={`/schedule?month=${activeMonthKey}`} />
                    <button className="button secondary" type="submit" disabled={!canCancel}>Cancel booking</button>
                  </form>
                ) : (
                  <form method="post" action={`/api/site/trainings/${selectedTraining.id}/book`}>
                    <input type="hidden" name="redirectTo" value={`/schedule?month=${activeMonthKey}`} />
                    <button className="button primary" type="submit" disabled={!isBookable}>Book this training</button>
                  </form>
                )
              ) : (
                <Link className="button primary" href={loginRedirectHref}>Login to book</Link>
              )}
              <button type="button" className="button secondary" onClick={() => setSelectedTrainingId(null)}>
                Back to calendar
              </button>
            </div>

            <div className="modal-training-nav">
              <button
                type="button"
                className="button secondary"
                onClick={() => selectedIndex > 0 && setSelectedTrainingId(monthTrainings[selectedIndex - 1].id)}
                disabled={selectedIndex <= 0}
              >
                Previous training
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => selectedIndex < monthTrainings.length - 1 && setSelectedTrainingId(monthTrainings[selectedIndex + 1].id)}
                disabled={selectedIndex < 0 || selectedIndex >= monthTrainings.length - 1}
              >
                Next training
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
