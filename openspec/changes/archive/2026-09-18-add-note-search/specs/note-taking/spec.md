## ADDED Requirements

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
