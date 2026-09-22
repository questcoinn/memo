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

### Requirement: Subheading formatting via Tab-confirm
The system SHALL let the user turn a line starting with `## ` into a visually distinct subheading, confirmed either by pressing Tab while editing that line or by the line losing focus (the caret moving to a different line, including by pressing Enter to start a new line, or by the user navigating away from the note). A line SHALL NOT be rendered as a subheading merely because it starts with `## ` while it is still the line currently being actively edited — rendering happens only on Tab, on losing focus, or when the note is (re)opened and the line already contains the marker. Tab is the only confirmation trigger available while the caret remains on that exact line without moving away; losing focus exists specifically so this works on touch devices whose on-screen keyboards have no Tab key. Backspace at the very start of a confirmed subheading line depends on its content and on the preceding line: if the subheading has no content and a preceding line exists, Backspace SHALL remove the subheading line entirely and place the caret at the end of the preceding line; if the subheading has no content and no preceding line exists, Backspace SHALL revert it to plain text with the `## ` marker restored; if the subheading has content and the immediately preceding line is an empty plain-text line, Backspace SHALL remove only that empty preceding line, leaving the subheading itself unchanged; if the subheading has content and there is a preceding line that is not an empty plain-text line, Backspace SHALL merge the subheading's text onto the end of that preceding line and remove the subheading line, dropping its subheading styling; if the subheading has content and there is no preceding line at all, Backspace SHALL do nothing.

#### Scenario: Typing the marker alone does not yet apply the style
- **WHEN** the user types `## ` at the start of a line and continues typing on that same line, without pressing Tab and without the line losing focus
- **THEN** the line is still displayed as plain text, including the `## ` marker

#### Scenario: Tab confirms the subheading
- **WHEN** the user has typed a line starting with `## ` and presses Tab while still editing that line
- **THEN** the line is rendered as a subheading, and the `## ` marker is no longer shown as literal text

#### Scenario: Losing focus also confirms the subheading
- **WHEN** the user has typed a line starting with `## ` and moves the caret away from that line without pressing Tab (for example, by tapping a different line, or pressing Enter to start a new line)
- **THEN** the line is rendered as a subheading, the same as if Tab had been pressed

#### Scenario: A saved subheading renders immediately on reopen
- **WHEN** the user reopens a note whose stored body contains a line starting with `## `
- **THEN** that line is rendered as a subheading immediately, without the user pressing Tab

#### Scenario: Backspace on an empty subheading deletes the line instead
- **WHEN** the user places the caret at the very start of a confirmed subheading line that has no content, there is a preceding line, and presses Backspace
- **THEN** the empty subheading line is removed entirely, and the caret is placed at the end of the preceding line

#### Scenario: Backspace on a non-empty subheading removes an empty line above it, unchanged
- **WHEN** the user places the caret at the very start of a confirmed subheading line that has content, the immediately preceding line is an empty plain-text line, and presses Backspace
- **THEN** the empty preceding line is removed, and the subheading itself — its text and style — is unaffected

#### Scenario: Backspace on a non-empty subheading merges it into the line above
- **WHEN** the user places the caret at the very start of a confirmed subheading line that has content, the preceding line is not an empty plain-text line (it may be plain text with content, a list item, or another subheading), and presses Backspace
- **THEN** the subheading's text is appended to the end of the preceding line, the subheading line is removed, the preceding line's own type is unaffected, and the caret is placed at the point where the two texts joined

#### Scenario: Backspace on a non-empty subheading with nothing above it does nothing
- **WHEN** the user places the caret at the very start of a confirmed subheading line that has content and is the first line in the body, and presses Backspace
- **THEN** nothing changes

#### Scenario: A text selection starting at line start deletes the selection instead of reverting
- **WHEN** the user selects a range of text starting at the very beginning of a confirmed subheading line (not just a collapsed caret) and presses Backspace
- **THEN** the selected text is deleted and the line remains a subheading, rather than reverting to plain text

#### Scenario: Navigating away from a reverted line does not re-confirm it
- **WHEN** the user has reverted a subheading to plain text via Backspace, and then moves the caret away from that line and back (for example with arrow keys) without retyping the `## ` marker
- **THEN** the line remains plain text; it is not re-rendered as a subheading merely because the caret passed over or away from it

#### Scenario: Enter at the very start of a subheading pushes it down instead of splitting its text away
- **WHEN** the user places the caret at the very start of a confirmed subheading line that has content, and presses Enter
- **THEN** a new empty plain-text line is inserted above it, and the subheading itself, with its full original text, moves down unchanged and keeps its subheading style

### Requirement: Nested list formatting via Tab-confirm
The system SHALL let the user turn a line starting with `- ` into a list item, confirmed either by pressing Tab while editing that line or by the line losing focus, the same way subheadings are confirmed. Once a line is a confirmed list item, pressing Tab again while editing it SHALL increase its nesting depth by one level, up to a maximum of 4 levels (depth 0 through depth 3); Shift+Tab SHALL decrease its depth by one level. Depth changes require Tab/Shift+Tab specifically — losing focus only performs the initial plain-text-to-list-item confirmation, not a depth change, since it has no way to express "how many levels." A line starting with `- ` SHALL NOT be rendered as a list item merely because it was typed, before it is confirmed. The user SHALL be able to revert a confirmed list item line back to plain text, in place, by pressing Backspace at the start of that line, unless the list item has no content and a preceding line exists, in which case Backspace SHALL remove the line entirely and place the caret at the end of the preceding line, rather than leaving a marker-only line behind. Unlike a subheading, a reverted list item's `- ` marker and any indentation SHALL NOT be restored as literal text — only its bare text content remains.

#### Scenario: Typing the marker alone does not yet apply the style
- **WHEN** the user types `- ` at the start of a line and continues typing on that same line, without pressing Tab and without the line losing focus
- **THEN** the line is still displayed as plain text, including the `- ` marker

#### Scenario: Tab confirms the list item at depth 0
- **WHEN** the user has typed a line starting with `- ` and presses Tab while still editing that line
- **THEN** the line is rendered as a list item at the top nesting level

#### Scenario: Losing focus also confirms the list item at depth 0
- **WHEN** the user has typed a line starting with `- ` and moves the caret away from that line without pressing Tab
- **THEN** the line is rendered as a list item at the top nesting level, the same as if Tab had been pressed

#### Scenario: Tab on a confirmed list item increases its depth
- **WHEN** the user presses Tab while editing an already-confirmed list item that is not at the maximum depth
- **THEN** that list item's nesting depth increases by one level, shown with additional indentation

#### Scenario: Depth is capped at 4 levels
- **WHEN** the user presses Tab while editing a confirmed list item already at the maximum depth (depth 3)
- **THEN** the list item's depth does not increase further

#### Scenario: Shift+Tab decreases depth
- **WHEN** the user presses Shift+Tab while editing a confirmed list item at a depth greater than 0
- **THEN** that list item's nesting depth decreases by one level

#### Scenario: A saved list renders immediately on reopen
- **WHEN** the user reopens a note whose stored body contains lines starting with `- ` (at any supported nesting depth)
- **THEN** those lines are rendered as list items at their respective depths immediately, without the user pressing Tab

#### Scenario: Backspace reverts a list item to plain text without restoring its marker
- **WHEN** the user places the caret at the very start of a confirmed list item line that has content, and presses Backspace
- **THEN** the line returns to plain text in place, containing only its original bare text — no `- ` marker and no leading indentation spaces are added

#### Scenario: Backspace on an empty list item deletes the line instead
- **WHEN** the user places the caret at the very start of a confirmed list item line that has no content, there is a preceding line, and presses Backspace
- **THEN** the empty list item is removed entirely (at any nesting depth), and the caret is placed at the end of the preceding line

#### Scenario: A text selection starting at line start deletes the selection instead of reverting
- **WHEN** the user selects a range of text starting at the very beginning of a confirmed list item line (not just a collapsed caret) and presses Backspace
- **THEN** the selected text is deleted and the line remains a list item at its current depth, rather than reverting to plain text

#### Scenario: Navigating away from a reverted line does not re-confirm it
- **WHEN** the user has reverted a list item to plain text via Backspace, and then moves the caret away from that line and back (for example with arrow keys) without retyping the `- ` marker
- **THEN** the line remains plain text; it is not re-rendered as a list item merely because the caret passed over or away from it

#### Scenario: Enter on an empty list item exits list formatting instead of creating another one
- **WHEN** the user places the caret in a confirmed list item that has no content, and presses Enter
- **THEN** that line becomes a plain paragraph in place (no new line is created), rather than adding another empty list item below it

#### Scenario: Enter at the very start of a list item splits it into two list items, not a plain paragraph
- **WHEN** the user places the caret at the very start of a confirmed list item line that has content, and presses Enter
- **THEN** the line splits into two list items at the same depth — an empty one where the caret was, and one below it holding the original text — rather than inserting an unrelated plain-text line that would break the visual continuity of the list

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

### Requirement: Inline link formatting via existing confirm triggers
The system SHALL detect text within a line that begins with `http://`, `https://`, or `www.` and, when that line is confirmed by any of the same triggers already used for subheadings and list items (pressing Tab while editing that line, the line losing focus, or pressing Enter to split it), SHALL render each such matched span as a clickable, atomic link whose visible text and target are the same string — no markdown-style bracket syntax is involved. A line SHALL NOT render a URL-shaped span as a link merely because it was typed while it is still the line currently being actively edited, matching the same "typing alone doesn't apply the style" rule already in effect for subheadings and list items. Detection SHALL apply to text within any line regardless of that line's own type (plain paragraph, subheading, or list item), and SHALL apply to every matching span within a line, not only the first. A saved note whose stored body already contains such text SHALL render it as a link immediately on open, without the user retyping or reconfirming it.

A confirmed link SHALL be atomic: the caret SHALL NOT be positionable inside it, and its underlying text SHALL NOT remain editable in place. Opening a confirmed link SHALL require a Cmd/Ctrl+click; a plain click on it SHALL behave the same as clicking anywhere else in the editable text (placing the caret) and SHALL NOT navigate. Pressing Backspace with the caret immediately after a confirmed link SHALL remove it entirely, including its text — unlike reverting a subheading or list item, no marker-prefixed plain text is left behind.

#### Scenario: Typing URL-shaped text alone does not yet apply the style
- **WHEN** the user types text starting with `http://`, `https://`, or `www.` and continues typing on that same line, without pressing Tab, without the line losing focus, and without pressing Enter
- **THEN** the text is still displayed as plain, unstyled text

#### Scenario: Tab confirms a URL-shaped span into a link
- **WHEN** the user has typed URL-shaped text within a line and presses Tab while still editing that line
- **THEN** the matching span is rendered as a link, and the rest of the line's text is unaffected

#### Scenario: Losing focus also confirms a URL-shaped span into a link
- **WHEN** the user has typed URL-shaped text within a line and moves the caret away from that line without pressing Tab (for example, by tapping a different line, or pressing Enter to start a new line)
- **THEN** the matching span is rendered as a link, the same as if Tab had been pressed

#### Scenario: Multiple URLs in the same line are all confirmed together
- **WHEN** a line contains more than one URL-shaped span and the line is confirmed by any of the triggers above
- **THEN** every matching span in that line is rendered as a link, not only the first

#### Scenario: Link formatting applies inside subheadings and list items too
- **WHEN** a confirmed subheading's or list item's text contains URL-shaped text
- **THEN** that text is rendered as a link the same way it would be inside a plain paragraph

#### Scenario: A saved link renders immediately on reopen
- **WHEN** the user reopens a note whose stored body contains URL-shaped text
- **THEN** that text is rendered as a link immediately, without the user pressing Tab

#### Scenario: Cmd/Ctrl+click opens the link
- **WHEN** the user Cmd-clicks (or Ctrl-clicks) a confirmed link
- **THEN** the link's target opens in a new tab

#### Scenario: A plain click on a link does not navigate
- **WHEN** the user clicks a confirmed link without holding Cmd/Ctrl
- **THEN** the caret is placed at the click location and the link's target does not open

#### Scenario: Backspace immediately after a link removes it entirely
- **WHEN** the user places the caret immediately after a confirmed link and presses Backspace
- **THEN** the link is removed entirely, including its text, and no marker-prefixed plain text is left in its place

#### Scenario: Backspace at the very start of a line is unaffected by an adjacent link
- **WHEN** the caret is at the very start of a line whose first content is a confirmed link, and the user presses Backspace
- **THEN** the line's own block-level Backspace behavior (for example, reverting or merging a subheading or list item) applies, and the link itself is not removed by that press

#### Scenario: Pressing Enter preserves a confirmed link before the split point
- **WHEN** the user places the caret after a confirmed link within a line (anywhere later in that line) and presses Enter
- **THEN** the line splits in two, the confirmed link remains a link in the first (original) line exactly as it was, and the new second line — whatever text followed the caret — is plain, unconfirmed text

#### Scenario: Pressing Enter resets a confirmed link after the split point
- **WHEN** the user places the caret before a confirmed link within a line and presses Enter
- **THEN** the line splits in two, and the link — now entirely within the new second line — is plain, unconfirmed text rather than remaining a link

#### Scenario: Pasted URL-shaped text is detected the same as typed text
- **WHEN** the user pastes text containing a URL-shaped span into a line, whether alone or alongside other text
- **THEN** that text behaves exactly as if it had been typed — it is not yet a link until the line is next confirmed, and confirming it detects and converts the URL-shaped span the same way it would if typed

#### Scenario: Merging a line into the previous one preserves any confirmed link
- **WHEN** the user places the caret at the very start of a line that has content and is not itself a subheading or list item, there is a preceding line, and presses Backspace
- **THEN** the line's content is merged onto the end of the preceding line and the line itself is removed, and any confirmed link that was in either line remains a link afterward

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
