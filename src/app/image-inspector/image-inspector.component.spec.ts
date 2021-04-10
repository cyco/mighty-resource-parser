import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageInspectorComponent } from './image-inspector.component';

describe('ImageInspectorComponent', () => {
  let component: ImageInspectorComponent;
  let fixture: ComponentFixture<ImageInspectorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImageInspectorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
