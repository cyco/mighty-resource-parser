import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShapeImageComponent } from './shape-image.component';

describe('ShapeImageComponent', () => {
  let component: ShapeImageComponent;
  let fixture: ComponentFixture<ShapeImageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ShapeImageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
