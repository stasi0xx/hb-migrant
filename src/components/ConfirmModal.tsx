'use client';

interface ConfirmModalProps {
    isOpen: boolean;
    question: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    question,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ zIndex: 99999 }}
                onClick={onCancel}
            />

            {/* Modal */}
            <div
                className={`fixed left-1/2 top-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl p-6 transition-all duration-200 ${isOpen ? 'opacity-100 -translate-y-1/2 scale-100' : 'opacity-0 -translate-y-[calc(50%+12px)] scale-95 pointer-events-none'}`}
                style={{ zIndex: 99999 }}
            >
                <p className="font-heading text-xl text-[#1C3D1C] text-center mb-6">{question}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-[#1C3D1C]/15 text-sm font-semibold text-[#1C3D1C]/60 hover:bg-[#1C3D1C]/5 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition-colors"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </>
    );
}
