import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { defer, finalize, NEVER, share } from 'rxjs';
import { SpinnerOverlayComponent } from '../spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
    private overlayRef: OverlayRef = undefined;

    constructor(private readonly overlay: Overlay) {}

    public readonly spinner = defer(() => {
        this.show();        
        return NEVER.pipe(
            finalize(() => {
                this.hide();
            })
        );
    }).pipe(share());

    private show(): void {        
        // To avoide ExpressionChangedAfterItHasBeenCheckedError
        Promise.resolve(null).then(() => {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically(),
            hasBackdrop: true,
        });
        this.overlayRef.attach(new ComponentPortal(SpinnerOverlayComponent));
        });
    }

    private hide(): void {        
        this.overlayRef.detach();
        this.overlayRef = undefined;
    }
}
