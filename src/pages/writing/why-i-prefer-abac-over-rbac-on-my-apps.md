---
title: "Why I prefer ABAC over RBAC on my apps"
date: "2025-09-01"
layout: "../../layouts/WritingLayout.astro"
category: "insights"
posted: true
---

I have worked with both ABAC and RBAC permission models. While I see the usefulness of both, I believe we often default to RBAC even when it can limit powerful options for users.

But first of all, what are those acronyms?

**RBAC** stands for Role-Based Access Control. It means users can perform actions based on their assigned role (Admin, User, Visitor, etc.). This is easy to work with for both developers and users. However, in complex systems (and I would argue even in simpler ones), it often lacks the granularity you need.

**ABAC** stands for Attribute-Based Access Control. It means users are granted permissions at a more detailed level in the system, such as per module or per action. This gives admins far more control when defining what each user can access.

RBAC is much more common than ABAC. Even major auth providers like Firebase Auth, Auth0, and Okta do not offer native ABAC support. [Better Auth](https://better-auth.com/) also does not include native ABAC out of the box, but it is flexible enough to implement it cleanly in your own data model and authorization layer.

While this can make development easier at first, I believe it can reduce both security and user experience in some cases. I decided to stick with ABAC for my B2B products, and my users love it. In my case, I split permissions by module and, in some projects, also by write/read capabilities. For example, a user may be allowed to read finances, read inventory, and modify to-dos, while having no access to anything else.