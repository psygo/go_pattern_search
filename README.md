# Go Pattern Search

In this project, we replicate the SGF game trees as graphs inside Neo4j, and then outsource the search through patterns to Neo4j, as it is an optimized graph database.

This project is heavily influenced by [Waltheri's Go Pattern Search](http://ps.waltheri.net/). In that project, its author used each game's last snapshot as a way of making comparisons with other games.

Another alternative to modeling this problem is through _Regular Expressions_ &mdash; regexes can actually be modeled as graphs as well &mdash;, I believe. Since SGF files track move coordinates as strings, we could search patterns in strings as patterns in the game. Coincidentally, regular expressions are also used fact optimizations in my graph approach.

## 1. Tasks

- Pattern-Search
  - [x] Sequential Pattern-Search
  - Stone-based filtering
    - [ ] Contains only selected stones
    - [ ] Contains selected stones
  - [ ] Rotation on Searches
  - [ ] Regular-search, such as player name, date, etc.
  - [ ] Add text/move-comment search.
  - [ ] Quadrant-barsed pattern search (reflections also count)
- DB
  - [ ] SGF fields for the game nodes
  - Indexes
    - [ ] Index on moves
    - [ ] Index on edited stones
  - Data
    - [ ] Add large number of games (GoGod? Go4Go?)
    - [ ] Add tsumegos
    - [ ] Add lecture-based content (à la Yunguseng Dojang (Inseong Hwang))
- UI
  - Goban Component
    - [ ] Stone placement
    - [ ] Stone deletion
    - [ ] Move numbering
  - Filters
    - [ ] Sequential
    - [ ] Stone-based (for edited stones)
    - [ ] Rotation
    - [ ] Region-based
    - Stone-based filtering
      - [ ] Contains only selected stones
      - [ ] Contains selected stones
  - [ ] URL-based filtering for the search
  - [ ] Regular-search, such as player name, date, etc.
  - [ ] Add text/move-comment search.

## 2. Tech Stack

- Neo4j
  - If in-memory, one could choose the package [Graphology](https://github.com/graphology/graphology), I guess.
- NextJS (ReactJS) + MUI
- Sabaki's SGF Parser
- Custom Go Board HTML Canvas Component

## 3. References

### 3.1. Pattern Search

- [Waltheri's Go Pattern Search](http://ps.waltheri.net/)
- [Waltheri on Github](https://github.com/waltheri)
  - [Waltheri's List of Go Libraries and Resources](https://github.com/waltheri/go-libraries)

### 3.2 Board Editor

- [Sabaki's Board Editor: Shudan](https://github.com/SabakiHQ/Shudan)
  - [Trying to Make Shudan Work With NextJS](https://github.com/SabakiHQ/Shudan/issues/1#issuecomment-1820779837)

### 3.3. SGF

- [Sabaki's SGF Parser](https://github.com/SabakiHQ/sgf)
- [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
  - [Alternative SGF's Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)

### 3.4. Related Questions on Stack Overflow

- [How to Recursively Create a Tree with Cypher (Neo4j)](https://stackoverflow.com/q/77495108/4756173)
- [How to (Efficiently) Find Subpaths in Recursive Trees through Cypher (Graph vs Regex)](https://stackoverflow.com/q/77497411/4756173)

### 3.5. Miscellanea

- [Graphology](https://github.com/graphology/graphology)
