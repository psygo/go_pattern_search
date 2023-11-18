# Go Pattern Search

In this project, we replicate the SGF game trees as graphs inside Neo4j, and then outsource the search through patterns to Neo4j, as it is an optimized graph database.

<!-- TODO: Mention Waltheri Pattern Search -->
<!-- TODO: Mention that this problem could also be modeled as a Regex problem -->

<!-- Tasks: -->
<!-- TODO: URL-based filtering for the search -->
<!-- TODO: Stone-based filtering -->
<!-- TODO: Rotation on Searches -->
<!-- TODO: Also regular-search, such as player name, date, etc. -->

## Current Stack

- Neo4j
  - If in-memory, one could choose the package [graphology](https://github.com/graphology/graphology), I guess.
- NextJS (ReactJS) + MUI
- Sabaki's SGF Parser
- Custom HTML Canvas for Displaying and Editing the SGF files.

## References

- [Sabaki's SGF Parser](https://github.com/SabakiHQ/sgf)
- [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
  - [Alternative SGF's Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)
