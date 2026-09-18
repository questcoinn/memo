## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Explicit save
**Reason**: Replaced by automatic (debounced) persistence — the product no longer has a save action for the user to take.
**Migration**: Superseded by the new "Autosave persists changes automatically" requirement. No stored state needs migrating.

### Requirement: Unsaved changes are protected from silent loss
**Reason**: This confirm()-based guard existed to prevent losing an edit that only a button click would persist. With autosave, navigating away immediately flushes the pending save instead, so there is nothing left to lose and nothing to confirm.
**Migration**: Superseded by the flush-on-navigate-away scenario in the new "Autosave persists changes automatically" requirement.

## ADDED Requirements

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
