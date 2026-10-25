---
title: "What I learned building an ERP from scratch"
date: "2026-03-17"
layout: "../../layouts/WritingLayout.astro"
category: "project"
posted: true
---

Building an ERP is one of the experiences from which I have learned the most. It took years and way too many refactors, but now it is in production and the whole company uses it. If you are going to build one, or are just curious, here is what I learned.

## 1. Communication is key

Before I started development, I thought the software part would be the hardest. I was wrong. Although coding is a full challenge, communication is just as difficult. You need to speak with everyone you are building for. And the challenge is not only social: you need a deep understanding of every area and every process. You need to ask the right questions, map workflows, and truly understand how the business works. By the time you finish an ERP, you should be comfortable covering for almost anyone on vacation, because you understand each role: sales, warehouse, import/export, and more.

## 2. Frontend does not need too much detail

You might think that because it is a big project, the frontend should be highly polished in every corner, but I learned otherwise. It is often a poor use of time. The frontend should be good enough, and the design should be clean and intuitive, but that is it. You should not try to make it perfect.

## 3. Backend does need much more detail

An ERP usually consists of many modules, tens of thousands of lines of code, dozens of tables, and many shared utilities. In that level of complexity, a clean and consistent structure is necessary. Technical debt becomes very hard to pay once you pass a certain size. I eventually had to do an almost complete rewrite. Clean code, strong data structures, and good design patterns are your best defense against this.

I recommend using a solid backend framework. In my case, I used NestJS because I was using TypeScript. The framework is opinionated and fairly strict in how you structure things, which helps keep order.

I also recommend investing in high-quality shared utilities. The functions you reuse everywhere can define your overall quality. One bad function is not too harmful, but one bad function copied into 20 modules is dangerous.

## 4. Databases need way more attention to detail

The database is the foundation of the project, and your code will eventually reflect your schema decisions. A poorly normalized field or slow structure can seriously hurt both cleanliness and performance. I recommend studying SQL in depth before committing too far. I chose PostgreSQL because it is one of the most feature-complete SQL databases available.

In my schema, I ended up using JSONB fields, generated columns, enums, indexes, complex constraints, NUMERIC columns, functions, arrays, and strategic denormalization, among other advanced features.

In my queries, I used CTEs, window functions, subqueries, joins across many tables, `ON CONFLICT`, `DISTINCT ON`, and `CASE WHEN` clauses. Some queries are around 30 lines long, combining CTEs, subqueries, and joins in one statement.

Do not worry, even if this sounds hard. You just need to **study** (maybe a lot). Once you get a strong grasp of SQL, things become much easier to reason about. You start to understand your data structures and queries quickly, and you can design performant, normalized structures for each module with much less friction.

## 5. Create great tools to work with PDFs and Excel

You will face many import/export requirements: exporting materials to Excel, generating PDFs from records, creating user credentials in one click, or importing rows into tables from Excel files.

Take time to define how your system reads and generates these file types. You will use these workflows throughout development.

## 6. Sanitize your inputs

You may think that because your users are known employees, you can be less strict with input validation. That is completely wrong. Treat every input as potentially harmful. People will type `10e24` into numeric fields, leave required fields blank, or add decimals where they should not. I use Zod to validate and transform user input. Always validate on the server side.

## 7. Log and backup everything

People will break things. They will delete records they should not delete, and they will enter incorrect amounts. And even if users don't make mistakes, your system can still fail. A bad implementation or disk corruption can cause serious issues. You should keep daily backups of your database on a different machine, and you should log every action each user performs. I implemented a `records` table and add a row for every action. Something like _"User X deleted row Y in table Z"_ is usually enough. You should also log every exception your code throws.

Things will break. It is your responsibility to know why, when, and who was involved, then understand the problem well enough to fix it correctly.

## 8. Deployment should be simple

When I first deployed the ERP, I used a VPS, Docker Compose, and some Bash scripts. But I still had to configure HTTPS, logging, backups, and more. That is a hassle, and it should not be. You are deploying an internal tool, not Amazon. I recommend creating Dockerfiles for frontend and backend (or one Dockerfile if you serve frontend files through the API), then deploying to a managed service. I usually use Railway, although if you already have a VPS, you can install Coolify or Dokploy. This helps you spend less time on deployment and more time on product development.

## Conclusion

Building a great ERP is a big task, full of challenges and learning opportunities. But if you take the time to analyze, learn, read, and test every part of the system, you should avoid major problems.