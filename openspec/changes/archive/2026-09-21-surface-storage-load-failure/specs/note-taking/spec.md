## ADDED Requirements

### Requirement: Load failure is shown, not hidden
If the notes stored on the device exist but cannot be read back (for example, the underlying data is corrupted), the system SHALL show the user an explicit message in the list panel indicating the notes failed to load, distinct from the message shown when there genuinely are no notes. The system SHALL continue to allow normal use — creating, editing, and deleting notes — after this message is shown. The system SHALL preserve the original unreadable data rather than letting it be silently overwritten and lost by a subsequent save, and SHALL offer the user a way to view and copy that preserved raw data. The system SHALL NOT attempt to interpret or automatically restore the unreadable data as notes.

#### Scenario: Corrupted stored data shows a load-failure message
- **WHEN** the stored notes data exists but cannot be read back
- **THEN** the list panel shows a message indicating the notes failed to load, distinct from the "no notes yet" empty-state message

#### Scenario: Genuinely empty storage still shows the plain empty state
- **WHEN** there is no stored notes data at all (first use, or every note has been deleted)
- **THEN** the list panel shows the ordinary empty-state message, not a load-failure message

#### Scenario: A load failure does not block normal use
- **WHEN** a load-failure message is being shown
- **THEN** the user can still create a new note, and edit or delete any note created since, without restriction

#### Scenario: The unreadable data is preserved rather than destroyed
- **WHEN** a load failure has occurred and the user subsequently saves a note
- **THEN** the original unreadable data is preserved rather than being overwritten and permanently lost by that save

#### Scenario: The preserved raw data is shown and can be copied
- **WHEN** a load failure has occurred and no note is currently open for editing
- **THEN** the view/edit area shows the preserved raw data as plain text and offers a way to copy it, instead of the usual "select or start a note" placeholder
