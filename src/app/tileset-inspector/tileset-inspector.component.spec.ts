import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TilesetInspectorComponent } from './tileset-inspector.component';

describe('TilesetInspectorComponent', () => {
  let component: TilesetInspectorComponent;
  let fixture: ComponentFixture<TilesetInspectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TilesetInspectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilesetInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
