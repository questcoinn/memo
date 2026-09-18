# note-taking Specification

## Purpose

Lets a person capture, revisit, edit, and discard short personal notes through a list-and-detail interface, with their notes surviving a page reload.

## Requirements

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

### Requirement: Search filters the note list by keyword
The system SHALL let the user filter the note list by a text query matched against each note's title and body. Matching SHALL be case-insensitive. The query SHALL be split on whitespace into words, and a note SHALL match only if every word appears as a substring in its title or its body. The system SHALL update the displayed list live as the query changes, without requiring an explicit search action.

#### Scenario: Empty query shows the full list
- **WHEN** the search field is empty
- **THEN** the note list shows all notes, unfiltered

#### Scenario: Matching note appears in results
- **WHEN** the user types a word that appears in a note's title or body
- **THEN** that note appears in the filtered list

#### Scenario: Non-matching note is excluded
- **WHEN** the user types a word that does not appear in a note's title or body
- **THEN** that note does not appear in the filtered list

#### Scenario: Multiple words require all to match
- **WHEN** the user types two words, one that appears in a note's title and another that appears in the same note's body
- **THEN** that note appears in the filtered list
- **AND** a note containing only one of the two words does not appear

#### Scenario: No results shows a distinct message
- **WHEN** the query matches no notes
- **THEN** the list panel shows a message indicating no notes match the query, distinct from the message shown when there are no notes at all

#### Scenario: Live filtering without an explicit action
- **WHEN** the user types into the search field
- **THEN** the list updates to reflect the new query without the user taking any separate search action

### Requirement: Create a note as a draft
Starting a new note SHALL open an empty, editable draft in the view/edit area. The draft SHALL NOT appear in the note list, and SHALL NOT be persisted, until it has content: a non-empty title or body.

#### Scenario: New note is not yet in the list
- **WHEN** the user starts a new note and has not yet entered any title or body text
- **THEN** the note list does not contain an entry for it

#### Scenario: Saving a new note adds it to the list
- **WHEN** the user starts a new note and enters a non-empty title or body
- **THEN** the note is automatically persisted and appears in the note list

#### Scenario: Walking away from an untouched draft discards it
- **WHEN** the user starts a new note, enters no content, and navigates away
- **THEN** no note is created and nothing appears in the note list

### Requirement: Edit an existing note as a draft
Opening an existing note for editing SHALL let the user change its title and body. The system SHALL persist those edits automatically, without requiring an explicit save action, after a brief pause in typing.

#### Scenario: Unsaved edit does not change the list yet
- **WHEN** the user is actively typing in the title or body of an existing note
- **THEN** the system is not required to have persisted that keystroke yet

#### Scenario: Saving an edit updates the note
- **WHEN** the user edits a note and stops typing
- **THEN** the note's stored title and body reflect the edit, and its updated time advances, without the user taking any explicit save action

### Requirement: Autosave persists changes automatically
The system SHALL persist a draft's title/body edits automatically after a brief pause in typing, without requiring any explicit user save action. When the user navigates away from a dirty draft — by selecting a different note, starting a new note, or going back to the list — the system SHALL immediately persist the pending edit rather than waiting for the pause to elapse.

#### Scenario: Autosave after a pause in typing
- **WHEN** the user edits a draft's title or body and then stops typing
- **THEN** the system persists the draft shortly after, without any save action from the user

#### Scenario: Navigating away flushes a pending edit immediately
- **WHEN** the user has just made an edit and immediately selects a different note, before the pause has elapsed
- **THEN** the system persists the pending edit right away before showing the newly selected note

#### Scenario: No confirmation is asked when navigating away
- **WHEN** the user navigates away from a dirty draft
- **THEN** the system does not ask the user to confirm anything before persisting and navigating

#### Scenario: A retry only happens on the next edit
- **WHEN** an autosave has failed and the user makes another edit
- **THEN** that edit's own pause-triggered autosave is a new attempt
- **AND** the system does not automatically retry on its own without a new edit

### Requirement: Ambient save-status feedback
While a draft has no autosave in flight and its last autosave attempt succeeded, the system SHALL NOT show any save-status message. While an autosave is in flight, the system SHALL show an in-progress message. If an autosave fails, the system SHALL show a failure message that remains visible until a later autosave attempt succeeds.

#### Scenario: Idle draft shows no status
- **WHEN** a draft has been successfully persisted and no new autosave is in flight
- **THEN** no save-status message is shown

#### Scenario: In-flight autosave shows a status message
- **WHEN** an autosave is in progress
- **THEN** the system shows a message indicating the save is in progress

#### Scenario: Failed autosave shows a persistent failure message
- **WHEN** an autosave fails
- **THEN** the system shows a failure message
- **AND** that message remains visible until a later autosave attempt succeeds

### Requirement: Delete a note with confirmation
The system SHALL let the user delete an existing note, and SHALL ask the user to confirm before the deletion takes effect. Dismissing the confirmation any way other than an explicit confirm SHALL be treated as declining.

#### Scenario: Deleting asks for confirmation
- **WHEN** the user chooses to delete a note
- **THEN** the system asks the user to confirm the deletion before removing it

#### Scenario: Confirmed deletion removes the note
- **WHEN** the user confirms deleting a note
- **THEN** the note no longer appears in the note list and is no longer persisted

#### Scenario: Cancelled deletion keeps the note
- **WHEN** the user is asked to confirm a deletion and declines
- **THEN** the note remains in the list, unchanged

#### Scenario: Dismissing without an explicit choice cancels
- **WHEN** the user dismisses the delete confirmation by clicking outside it or pressing Escape, without clicking either button
- **THEN** the note remains in the list, unchanged, the same as if the user had explicitly declined

### Requirement: Save failure is shown, not hidden
If a save or delete cannot be completed, the system SHALL show the user an explicit failure message rather than silently discarding the action or leaving no feedback.

#### Scenario: Save failure is surfaced
- **WHEN** saving a note's draft fails
- **THEN** the system shows a message indicating the save failed
- **AND** the user's unsaved draft content is not lost
