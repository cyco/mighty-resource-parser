import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaletteImageComponent } from './palette-image.component';

describe('PaletteImageComponent', () => {
  let component: PaletteImageComponent;
  let fixture: ComponentFixture<PaletteImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PaletteImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
