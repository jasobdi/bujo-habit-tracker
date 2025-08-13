'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/dialog/confirm-dialog';

type Props = {
    when: boolean; // ture = warn
    title?: string;
    description?: string;
};

/**
 * UnsavedChangesGuard component:
 * Warns users about unsaved changes when navigating away from the page.
 *  - when closing tab or reloading
 *  - when clicking internal links
 * Shows ConfirmDialog and only navigates away if user confirms.
 */

export function UnsavedChangesGuard({
    when,
    title = 'Discard changes?',
    description = 'You have unsaved changes. If you leave this page, your changes will be lost.',
}: Props) {
    const router = useRouter();
    const [pendingHref, setPendingHref] = useState<string | null>(null);
    const confirmOpenRef = useRef(false); // avoid multiple dialogs

    // 1) Warn on tab close / reload
    useEffect(() => {
        if (!when) return;
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [when]);

    // helper: determine if link is internal
    const isInternalHref = (href: string) => {
        try {
            const url = new URL(href, window.location.origin);
            return url.origin === window.location.origin;
        } catch {
            return false;
        }
    };

    // 2) Intercept internal link clicks
    useEffect(() => {
        if (!when) return;

        const onDocumentClick = (e: MouseEvent) => {
            // ignore modified clicks (cmd/ctrl/shift/alt) & middle click
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            // find nearest anchor
            const anchor = (e.target as HTMLElement)?.closest('a');
            if (!anchor) return;

            // external target?
            const target = anchor.getAttribute('target');
            if (target && target.toLowerCase() === '_blank') return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // only intercept internal navigations
            if (!isInternalHref(href)) return;

            // avoid intercepting same-page hash changes
            if (href.startsWith('#')) return;

            // if guarded -> stop, open dialog
            e.preventDefault();
            if (!confirmOpenRef.current) {
                confirmOpenRef.current = true;
                setPendingHref(href);
            }
        };

        document.addEventListener('click', onDocumentClick, true);
        return () => document.removeEventListener('click', onDocumentClick, true);
    }, [when]);

    // 3) Intercept browser back/forward
    useEffect(() => {
        if (!when) return;

        const onPopState = (e: PopStateEvent) => {
            // user hit back/forward -> ask
            e.preventDefault();
            if (!confirmOpenRef.current) {
                confirmOpenRef.current = true;
                // navigate back: target unknown -> after confirm, "go back"
                setPendingHref('__HISTORY_BACK__');
                // push state forward again to prevent immediate navigation
                history.pushState(null, '', window.location.href);
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [when]);

    const handleConfirm = () => {
        const dest = pendingHref;
        setPendingHref(null);
        confirmOpenRef.current = false;

        // remove unload guard just for this transition
        const unload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.removeEventListener('beforeunload', unload);

        // navigate
        if (dest === '__HISTORY_BACK__') {
            // go back
            window.history.back();
        } else if (dest) {
            router.push(dest);
        }
    };

    const handleCancel = () => {
        setPendingHref(null);
        confirmOpenRef.current = false;
    };

    return (
        <>
            {/* Only render dialog when a nav attempt is pending */}
            {when && pendingHref !== null && (
                <ConfirmDialog
                    title={title}
                    description={description}
                    destructive
                    confirmText="Leave"
                    cancelText="Stay"
                    onConfirm={handleConfirm}
                    open
                    onOpenChange={(nextOpen) => {
                        // when dialog is closed (not confirmed) it's handled like a cancel
                        if (!nextOpen) handleCancel();
                    }}
                />
            )}
        </>
    );
}