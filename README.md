# Go Pattern Search

In this project, we replicate the SGF game trees as graphs inside Neo4j, and then outsource the search through patterns to Neo4j, as it is an optimized graph database.

This project is heavily influenced by [Waltheri's Pattern Search](http://ps.waltheri.net/). In that project, its author used each game's last snapshot as a way of making comparisons with other games.

Another alternative to modeling this problem is through *Regular Expressions*, I believe. Since SGF files track move coordinates as strings, we could search patterns in strings as patterns in the game. Coincidentally, regular expressions are also used fact optimizations in my graph approach.

<!-- Tasks: -->
<!-- TODO: URL-based filtering for the search -->
<!-- TODO: Stone-based filtering -->
<!-- TODO: Rotation on Searches -->
<!-- TODO: Also regular-search, such as player name, date, etc. -->

## Current Stack

- Neo4j
  - If in-memory, one could choose the package [Graphology](https://github.com/graphology/graphology), I guess.
- NextJS (ReactJS) + MUI
- Sabaki's SGF Parser
- Custom HTML Canvas for Displaying and Editing the SGF files.

## References

### Pattern Search

- [Waltheri's Pattern Search](http://ps.waltheri.net/)

### SGF

- [Sabaki's SGF Parser](https://github.com/SabakiHQ/sgf)
- [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
  - [Alternative SGF's Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)

### Related Questions on Stack Overflow

- [How to Recursively Create a Tree with Cypher (Neo4j)](https://stackoverflow.com/q/77495108/4756173)
- [How to (Efficiently) Find Subpaths in Recursive Trees through Cypher (Graph vs Regex)](https://stackoverflow.com/q/77497411/4756173)

### Miscellanea

- [Graphology](https://github.com/graphology/graphology)
