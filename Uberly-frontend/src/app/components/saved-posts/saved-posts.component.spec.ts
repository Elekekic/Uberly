import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPostsComponent } from './saved-posts.component';

describe('SavedPostsComponent', () => {
  let component: SavedPostsComponent;
  let fixture: ComponentFixture<SavedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedPostsComponent]
    });
    fixture = TestBed.createComponent(SavedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
