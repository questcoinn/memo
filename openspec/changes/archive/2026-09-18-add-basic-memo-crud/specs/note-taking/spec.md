## Purpose

Lets a person capture, revisit, edit, and discard short personal notes through a list-and-detail interface, with their notes surviving a page reload.

## ADDED Requirements

### Requirement: Two-panel note browsing layout
The system SHALL present a list of the user's notes and a view/edit area for the currently selected note. On a viewport wide enough to show both, they SHALL be visible side by side. On a viewport too narrow to show both (down to 320px wide), the system SHALL show one of the two as a full-width screen at a time, with a way to return from the view/edit screen to the list.

#### Scenario: Wide viewport shows both panels
- **WHEN** the viewport is wide enough for a two-column layout
- **THEN** the note list and the view/edit area are both visible at the same time

#### Scenario: Narrow viewport shows one screen at a time
- **WHEN** the viewport is too narrow for a two-column layout and the user selects a note
- **THEN** the view/edit area is shown as a full-width screen and the list is not simultaneously visible
- **AND** the user has a way to go back to the full-width list screen

### Requirement: Notes persist across reloads
Notes the user has saved SHALL still be present, unchanged, after the page is reloaded or the app is reopened.

#### Scenario: Saved note survives a reload
- **WHEN** the user has saved a note and then reloads the page
- **THEN** the note still appears in the list with the same title and body

### Requirement: Note list ordering
The note list SHALL be ordered with the most recently updated note first.

#### Scenario: Editing a note moves it to the top
- **WHEN** the user saves an edit to a note that is not currently at the top of the list
- **THEN** that note moves to the top of the list

### Requirement: Empty list state
When the user has no notes, the system SHALL show an explicit empty-state message in the list panel instead of leaving the area blank.

#### Scenario: No notes yet
- **WHEN** the user has never created a note, or has deleted all of their notes
- **THEN** the list panel shows a message indicating there are no notes yet, rather than an empty blank area

### Requirement: Create a note as a draft
Starting a new note SHALL open an empty, editable draft in the view/edit area. The draft SHALL NOT appear in the note list, and SHALL NOT be persisted, until the user explicitly saves it.

#### Scenario: New note is not yet in the list
- **WHEN** the user starts a new note and has not yet saved it
- **THEN** the note list does not contain an entry for it

#### Scenario: Saving a new note adds it to the list
- **WHEN** the user starts a new note, enters content, and saves it
- **THEN** the note appears in the note list

### Requirement: Edit an existing note as a draft
Opening an existing note for editing SHALL let the user change its title and body without those changes being persisted, or reflected in the note list, until the user explicitly saves.

#### Scenario: Unsaved edit does not change the list yet
- **WHEN** the user edits the title or body of an existing note but does not save
- **THEN** the note list still shows the note's previously saved title

#### Scenario: Saving an edit updates the note
- **WHEN** the user edits a note and saves it
- **THEN** the note's stored title and body reflect the edit, and its updated time advances

### Requirement: Explicit save
The system SHALL only persist a note's create or edit when the user takes an explicit save action. It SHALL NOT persist changes automatically while the user is typing.

#### Scenario: Typing alone does not persist
- **WHEN** the user types into the title or body of a draft without taking the save action
- **THEN** no persisted note is created or changed as a result

### Requirement: Unsaved changes are protected from silent loss
When the user has an unsaved draft (a new note, or edits to an existing note) and takes an action that would discard it — selecting a different note, or starting another new note — the system SHALL ask the user to confirm before discarding the draft.

#### Scenario: Switching notes with unsaved changes prompts confirmation
- **WHEN** the user has an unsaved draft open and selects a different note in the list
- **THEN** the system asks the user to confirm discarding the unsaved draft before switching
- **AND** if the user cancels, the draft remains open and unchanged

#### Scenario: Confirming discards the draft
- **WHEN** the user has an unsaved draft open, selects a different note, and confirms discarding
- **THEN** the draft is discarded and the newly selected note is shown

### Requirement: Delete a note with confirmation
The system SHALL let the user delete an existing note, and SHALL ask the user to confirm before the deletion takes effect.

#### Scenario: Deleting asks for confirmation
- **WHEN** the user chooses to delete a note
- **THEN** the system asks the user to confirm the deletion before removing it

#### Scenario: Confirmed deletion removes the note
- **WHEN** the user confirms deleting a note
- **THEN** the note no longer appears in the note list and is no longer persisted

#### Scenario: Cancelled deletion keeps the note
- **WHEN** the user is asked to confirm a deletion and declines
- **THEN** the note remains in the list, unchanged

### Requirement: Save failure is shown, not hidden
If a save or delete cannot be completed, the system SHALL show the user an explicit failure message rather than silently discarding the action or leaving no feedback.

#### Scenario: Save failure is surfaced
- **WHEN** saving a note's draft fails
- **THEN** the system shows a message indicating the save failed
- **AND** the user's unsaved draft content is not lost
