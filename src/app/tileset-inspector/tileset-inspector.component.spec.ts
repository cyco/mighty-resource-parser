import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetInspectorComponent } from './tileset-inspector.component';

describe('TilesetInspectorComponent', () => {
  let component: TilesetInspectorComponent;
  let fixture: ComponentFixture<TilesetInspectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilesetInspectorComponent ]
    })
    .compileComponents();
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
