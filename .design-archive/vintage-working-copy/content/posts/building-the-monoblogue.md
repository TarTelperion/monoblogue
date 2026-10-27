---
title: "Building a garden with routes"
slug: "building-the-monoblogue"
summary: "Design notes from turning a wireframe into a small, deliberately wandering website."
published: "2026-10-24"
updated: ""
status: "published"
section: "programming"
categories:
  - "making"
languages: []
featured: false
featuredOrder: 0
void:
  weight: 5
  accent: "green"
---

The Monoblogue begins with a contradiction: it needs enough structure to remain maintainable and enough looseness to reward wandering.

The current solution is to keep the content ordinary—Markdown files with explicit metadata—and let the interface behave strangely on top of it. The Library provides shelves. The Void scatters the same material across the floor.

That separation is useful. Experimental navigation should be an invitation, not a toll booth.

```js
const garden = content.map((post) => ({
  ...post,
  position: somewhereUnexpected()
}));
```

This is sample programming content for layout development.
