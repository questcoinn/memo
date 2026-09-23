## REMOVED Requirements

### Requirement: Tags on a note card are descriptive, not an interactive filter
**Reason**: Superseded by this change — tag chips on a note card now act as filter toggles, and the keyword search field combines with the active tag filters.
**Migration**: None for stored data (no schema change). Any code or test asserting that clicking a tag is a no-op, or that search ignores tags, must be updated to expect filtering behavior instead.

Tags shown on a note card SHALL be presentational only in this scope. Clicking a tag on a note card SHALL NOT filter the note list, and the search field SHALL continue to match only title and body, not tags.

#### Scenario: Clicking a tag does not filter the list
- **WHEN** the user clicks a tag shown on a note card
- **THEN** the note list is not filtered by that tag

#### Scenario: Search does not match tags
- **WHEN** the user types a query into the search field that matches one of a note's tags but appears in neither its title nor its body
- **THEN** that note does not appear in the filtered list

## ADDED Requirements

### Requirement: Tag chips filter the note list
Clicking a tag chip shown on a note card SHALL toggle that tag as an active filter: if the tag is not currently an active filter, clicking it SHALL add it; if the tag is already an active filter, clicking it (on any card where it is still visible) SHALL remove it. A tag chip that is an active filter SHALL be visually distinguished from one that is not. Clicking a tag chip SHALL NOT navigate to that note's view/edit area.

#### Scenario: Clicking an unselected tag adds it as a filter
- **WHEN** the user clicks a tag chip that is not currently an active filter
- **THEN** that tag becomes an active filter and the note list narrows to notes carrying that tag
- **AND** the note card the user clicked on is not opened for viewing or editing

#### Scenario: Clicking an already-selected tag removes it as a filter
- **WHEN** the user clicks a tag chip that is currently an active filter
- **THEN** that tag is no longer an active filter and the note list updates accordingly

#### Scenario: Active tag chips look distinct
- **WHEN** a tag is an active filter
- **THEN** every chip for that tag, on every visible note card, is styled differently from a tag chip that is not an active filter

### Requirement: Multiple tag filters combine with AND
When more than one tag is an active filter, the note list SHALL show only notes that carry every one of the active tags. A note missing any one of the active tags SHALL be excluded.

#### Scenario: Two active tags require both
- **WHEN** two tags are active filters
- **THEN** the note list shows only notes that have both of those tags

#### Scenario: A note with only one of the active tags is excluded
- **WHEN** two tags are active filters and a note has only one of them
- **THEN** that note does not appear in the note list

### Requirement: Active tag filters are shown and can be cleared
While one or more tags are active filters, the system SHALL display the set of active tag filters near the search field, independent of whether any note currently matches. Each active tag SHALL have its own control to remove it from the filter, and there SHALL be a control to clear all active tag filters at once. When no tag is an active filter, this display SHALL NOT be shown.

#### Scenario: Selecting a tag shows it in the active-filter display
- **WHEN** the user activates a tag filter
- **THEN** that tag appears in the active-filter display near the search field

#### Scenario: Clearing filters when no notes match
- **WHEN** the active tag filters (alone or combined with the keyword query) match no notes, so no note card is visible
- **THEN** the user can still remove an individual active tag or clear all active tags via the active-filter display

#### Scenario: Removing one active tag via its own control
- **WHEN** the user removes a single tag from the active-filter display
- **THEN** that tag is no longer an active filter, the note list updates, and any other active tags remain active

#### Scenario: Clearing all active tags at once
- **WHEN** the user uses the clear-all control
- **THEN** no tag remains an active filter and the active-filter display is no longer shown

#### Scenario: No display when no tag filter is active
- **WHEN** no tag is currently an active filter
- **THEN** the active-filter display is not shown

### Requirement: Tag filters combine with the keyword search
When one or more tags are active filters and the keyword search field also has a query, a note SHALL appear in the note list only if it matches the keyword query (per the existing title/body word-matching rule) AND carries every active tag filter. This applies independently of which was set first. When the combination of the keyword query and the active tag filters matches no notes, the list panel SHALL show a message indicating no notes match, distinct from the message shown when the user has no notes at all.

#### Scenario: Keyword query and tag filter both apply
- **WHEN** the keyword search field has a query and one or more tags are active filters
- **THEN** the note list shows only notes that match the keyword query and carry every active tag

#### Scenario: Tag filter alone, with an empty keyword query, still narrows the list
- **WHEN** the keyword search field is empty and one or more tags are active filters
- **THEN** the note list shows only notes carrying every active tag

#### Scenario: No-match message covers a tag filter with no keyword query
- **WHEN** the keyword search field is empty, one or more tags are active filters, and no note carries every active tag
- **THEN** the list panel shows a message indicating no notes match, distinct from the empty-notes-list message

#### Scenario: No-match message covers a combined keyword query and tag filter
- **WHEN** the keyword search field has a query, one or more tags are active filters, and no note satisfies both
- **THEN** the list panel shows a message indicating no notes match, distinct from the empty-notes-list message
