## ADDED Requirements

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
