## ADDED Requirements

### Requirement: Add a tag to a note
The system SHALL let the user add a tag to a note by typing text into a tag input in the edit area and confirming it, either by pressing Enter or by selecting a matching suggestion. A tag SHALL NOT be added if the typed text is empty or contains only whitespace. Leading and trailing whitespace SHALL be trimmed before the tag is stored.

#### Scenario: Typing a tag and pressing Enter adds it
- **WHEN** the user types a tag name into the tag input and presses Enter
- **THEN** a new tag chip appears for that tag, and it is included the next time the note autosaves

#### Scenario: Empty or whitespace-only input adds nothing
- **WHEN** the user presses Enter in the tag input while it is empty or contains only whitespace
- **THEN** no tag chip is added

### Requirement: Duplicate tags are prevented
The system SHALL NOT allow the same note to have the same tag twice. Matching for duplicates SHALL be case-insensitive.

#### Scenario: Re-adding an existing tag is a no-op
- **WHEN** the user tries to add a tag to a note that already has that same tag, in any letter casing
- **THEN** no second chip is added for it

### Requirement: Existing tags are suggested while typing
While the user types in the tag input, the system SHALL suggest tags already used on any of the user's other notes whose name contains the typed text as a case-insensitive substring, excluding tags already on the current note. Selecting a suggestion SHALL add that existing tag to the note, using its existing spelling, instead of creating a new differently-spelled tag.

#### Scenario: Matching existing tags are suggested
- **WHEN** the user types text that is a substring of a tag already used on another note
- **THEN** that existing tag appears as a suggestion

#### Scenario: Selecting a suggestion reuses the existing tag's spelling
- **WHEN** the user has typed a different letter casing of an existing tag (for example "Work" when "work" already exists) and selects the suggested tag
- **THEN** the tag is added to the note using the existing "work" spelling, not the newly typed casing

#### Scenario: Tags already on the note are not suggested again
- **WHEN** the user types text matching a tag the current note already has
- **THEN** that tag is not shown in the suggestion list

### Requirement: Remove a tag from a note
The system SHALL let the user remove a tag from a note in two ways: clicking a small remove control on the tag's chip, or pressing Backspace while the tag input is empty, which removes the most recently added chip.

#### Scenario: Removing a tag via its chip control
- **WHEN** the user clicks the remove control on a tag chip
- **THEN** that tag is removed from the note

#### Scenario: Backspace on an empty tag input removes the last tag
- **WHEN** the tag input is empty and the user presses Backspace
- **THEN** the most recently added tag chip is removed

#### Scenario: Backspace does nothing when the tag input has text
- **WHEN** the tag input contains typed text and the user presses Backspace
- **THEN** the text is edited as normal and no tag chip is removed

### Requirement: Tags are shown on the note card
Each note card in the note list SHALL display the note's tags. A note with no tags SHALL show its card without a tag list, rather than an empty placeholder.

#### Scenario: A note's tags appear on its card
- **WHEN** a note has one or more tags
- **THEN** its note card shows each of those tags

#### Scenario: A note without tags shows no tag list
- **WHEN** a note has no tags
- **THEN** its note card shows no tag list area

### Requirement: Tags on a note card are descriptive, not an interactive filter
Tags shown on a note card SHALL be presentational only in this scope. Clicking a tag on a note card SHALL NOT filter the note list, and the search field SHALL continue to match only title and body, not tags.

#### Scenario: Clicking a tag does not filter the list
- **WHEN** the user clicks a tag shown on a note card
- **THEN** the note list is not filtered by that tag

#### Scenario: Search does not match tags
- **WHEN** the user types a query into the search field that matches one of a note's tags but appears in neither its title nor its body
- **THEN** that note does not appear in the filtered list

### Requirement: Notes saved before tags existed load with an empty tag list
The system SHALL treat a stored note with no `tags` data as having an empty tag list, rather than failing to load or treating it as corrupted.

#### Scenario: A pre-existing note loads with no tags
- **WHEN** the app loads notes that were saved before tagging existed
- **THEN** those notes appear with an empty tag list instead of a load error
