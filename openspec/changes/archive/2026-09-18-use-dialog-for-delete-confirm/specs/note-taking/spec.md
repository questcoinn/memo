## MODIFIED Requirements

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
