## ADDED Requirements

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
