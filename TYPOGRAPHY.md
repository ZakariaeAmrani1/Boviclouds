# Typography System

This document outlines the standardized typography system implemented across the application.

## Typography Scale

### Headings

| Class       | Usage             | CSS Equivalent                                     | Examples                    |
| ----------- | ----------------- | -------------------------------------------------- | --------------------------- |
| `heading-1` | Page main titles  | `text-2xl lg:text-3xl font-bold text-gray-900`     | Dashboard main title        |
| `heading-2` | Section titles    | `text-xl lg:text-2xl font-bold text-gray-900`      | Page titles, major sections |
| `heading-3` | Subsection titles | `text-lg lg:text-xl font-semibold text-gray-900`   | Card titles, table sections |
| `heading-4` | Small headings    | `text-base lg:text-lg font-semibold text-gray-900` | Form sections               |

### Body Text

| Class        | Usage              | CSS Equivalent                       | Examples                 |
| ------------ | ------------------ | ------------------------------------ | ------------------------ |
| `body-large` | Large descriptions | `text-base lg:text-lg text-gray-700` | Feature descriptions     |
| `body-base`  | Standard body text | `text-sm lg:text-base text-gray-700` | Paragraphs, descriptions |
| `body-small` | Small text         | `text-xs lg:text-sm text-gray-600`   | Meta information         |

### Labels & Forms

| Class         | Usage        | CSS Equivalent                      | Examples     |
| ------------- | ------------ | ----------------------------------- | ------------ |
| `label-base`  | Form labels  | `text-sm font-medium text-gray-900` | Input labels |
| `label-small` | Small labels | `text-xs font-medium text-gray-700` | Helper text  |

### Buttons

| Class          | Usage            | CSS Equivalent          | Examples                  |
| -------------- | ---------------- | ----------------------- | ------------------------- |
| `button-base`  | Standard buttons | `text-sm font-semibold` | Primary/secondary buttons |
| `button-small` | Small buttons    | `text-xs font-semibold` | Icon buttons, compact UI  |

### Navigation

| Class           | Usage            | CSS Equivalent        | Examples                    |
| --------------- | ---------------- | --------------------- | --------------------------- |
| `nav-item`      | Navigation items | `text-sm font-medium` | Sidebar menu items          |
| `nav-secondary` | Secondary nav    | `text-xs font-medium` | Breadcrumbs, sub-navigation |

### Brand Elements

| Class            | Usage         | CSS Equivalent                    | Examples            |
| ---------------- | ------------- | --------------------------------- | ------------------- |
| `brand-title`    | Brand name    | `text-lg font-bold text-gray-900` | Logo text           |
| `brand-subtitle` | Brand tagline | `text-xs text-gray-500`           | Subtitle under logo |

### Utility Text

| Class        | Usage                  | CSS Equivalent                                              | Examples                 |
| ------------ | ---------------------- | ----------------------------------------------------------- | ------------------------ |
| `caption`    | Small descriptive text | `text-xs text-gray-500`                                     | Image captions, metadata |
| `overline`   | Uppercase labels       | `text-xs font-medium uppercase tracking-wide text-gray-500` | Section headers          |
| `badge-text` | Badge content          | `text-xs font-medium`                                       | Status badges, counters  |

### Tables

| Class          | Usage          | CSS Equivalent                                              | Examples       |
| -------------- | -------------- | ----------------------------------------------------------- | -------------- |
| `table-header` | Table headers  | `text-xs font-medium text-gray-500 uppercase tracking-wide` | Column headers |
| `table-cell`   | Table cells    | `text-sm text-gray-900`                                     | Data cells     |
| `table-meta`   | Table metadata | `text-xs text-gray-500`                                     | Row metadata   |

### Messages

| Class             | Usage            | CSS Equivalent            | Examples               |
| ----------------- | ---------------- | ------------------------- | ---------------------- |
| `message-error`   | Error messages   | `text-sm text-red-600`    | Form validation errors |
| `message-success` | Success messages | `text-sm text-green-600`  | Success notifications  |
| `message-warning` | Warning messages | `text-sm text-yellow-600` | Warning alerts         |
| `message-info`    | Info messages    | `text-sm text-blue-600`   | Information notices    |

## Responsive Behavior

The typography system uses responsive design with two main breakpoints:

- **Mobile (default)**: Smaller text sizes for space efficiency
- **Desktop (lg: and above)**: Larger text sizes for better readability

Most typography utilities automatically scale up on larger screens using the `lg:` prefix.

## Font Families

The application uses two primary font families:

- **Inter**: Default font for most UI elements (body text, labels, buttons)
- **Poppins**: Used sparingly for specific design elements

## Implementation Guidelines

### DO:

- Use the standardized typography classes consistently
- Combine typography classes with color and spacing utilities
- Follow the responsive patterns established in the system

### DON'T:

- Use arbitrary font sizes (`text-[14px]`)
- Mix font weights inconsistently
- Override typography classes with inline styles

## Examples

```tsx
// Page Title
<h1 className="heading-2 mb-4">Dashboard Overview</h1>

// Section with description
<div>
  <h2 className="heading-3 mb-2">User Management</h2>
  <p className="body-base text-gray-600">
    Manage all users in your organization
  </p>
</div>

// Form fields
<div>
  <label className="label-base mb-1">Email Address</label>
  <input className="body-base px-3 py-2 border rounded" />
  <p className="caption mt-1">Enter your work email</p>
</div>

// Buttons
<button className="button-base bg-blue-500 text-white px-4 py-2 rounded">
  Save Changes
</button>

// Table
<table>
  <thead>
    <tr>
      <th className="table-header">Name</th>
      <th className="table-header">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="table-cell">John Doe</td>
      <td className="table-cell">john@example.com</td>
    </tr>
  </tbody>
</table>

// Status badge
<span className="badge-text bg-green-100 text-green-800 px-2 py-1 rounded">
  Active
</span>

// Error message
<p className="message-error mt-1">This field is required</p>
```

## Migration Notes

When updating existing components:

1. Replace hardcoded Tailwind typography classes with the new utility classes
2. Remove font-family classes (`font-poppins`, `font-inter`) where the default Inter is sufficient
3. Update responsive patterns to use the `lg:` breakpoint consistently
4. Ensure all error messages use the `message-error` class
5. Replace table-specific typography with the standardized table classes

This typography system ensures consistency, maintainability, and a better user experience across all devices and screen sizes.
