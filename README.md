# Go Pattern Search

In this project, we replicate the SGF game trees as graphs inside Neo4j, and then outsource the search through patterns to Neo4j, as it is an optimized graph database.

## Current Stack

- Neo4j
  - If in-memory, one could choose the package `graphology`, I guess.
- NextJS (ReactJS) + MUI
- Sabaki's SGF Parser
- Custom HTML Canvas for Displaying and Editing the SGF files.

## References

- [Sabaki's SGF Parser](https://github.com/SabakiHQ/sgf)
