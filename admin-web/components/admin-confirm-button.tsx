"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  action: string;
  label: string;
  title: string;
  message: string;
  buttonClassName?: string;
  successRedirect?: string;
};

export function AdminConfirmButton({ action, label, title, message, buttonClassName = "button primary", successRedirect }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      setError(null);
      const response = await fetch(action, { method: "POST", credentials: "same-origin" });
      if (!response.ok) {
        setError("Confirmation failed.");
        return;
      }
      setOpen(false);
      if (successRedirect) {
        router.push(successRedirect);
        router.refresh();
        return;
      }
      router.refresh();
    });
  };

  return (
    <>
      <button className={buttonClassName} type="button" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div className="training-modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
          <div className="training-modal admin-confirm-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="training-modal-header">
              <div>
                <span className="eyebrow">Confirm action</span>
                <h3>{title}</h3>
              </div>
              <button type="button" className="modal-close" onClick={() => setOpen(false)} aria-label="Close dialog">
                Close
              </button>
            </div>

            <p className="muted">{message}</p>
            {error ? <p className="badge danger">{error}</p> : null}

            <div className="inline-actions" style={{ marginTop: 16 }}>
              <button className="button primary" type="button" onClick={submit} disabled={isPending}>
                {isPending ? "Saving..." : "Confirm"}
              </button>
              <button className="button secondary" type="button" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
