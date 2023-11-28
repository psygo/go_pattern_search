# Go Pattern Search

In this project, we replicate the SGF game trees as graphs inside Neo4j, and then outsource the search through patterns to Neo4j, as it is an optimized graph database.

This project is heavily influenced and inspired by [Waltheri's Go Pattern Search](http://ps.waltheri.net/). In that project, its author used each game's last snapshot as a way of making comparisons with other games.

Another alternative to modeling this problem is through _Regular Expressions_ &mdash; regexes can actually be modeled as graphs as well &mdash;, I believe. Since SGF files track move coordinates as strings, we could search patterns in strings as patterns in the game. Coincidentally, regular expressions are also used fact optimizations in my graph approach.

## 1. Tasks and Ideas

### 1.1. Tasks

> (Kind lost my patience with implementing a Goban, so the current one is kind of crap, sorry. Everything seemed to be working fine but then I added some sizing parameters and things went awry.)

- Pattern-Search
  - [x] Sequential Pattern-Search
  - Stone-based filtering
    - [x] Contains only selected stones
    - [x] Contains selected stones
  - [x] Rotation on Searches
  - [ ] Regular-search, such as player name, date, etc.
  - [ ] Add text/move-comment search.
  - [ ] Quadrant-based pattern search (reflections also count)
  - [ ] Region-based pattern search (reflections also count)
- DB
  - [ ] SGF fields for the game nodes
  - Indexes
    - [x] Index on moves
    - [x] Index on edited stones
  - Data
    - [ ] Add large number of games (GoGod? Go4Go?)
    - [ ] Add tsumegos
    - [ ] Add lecture-based content (à la Yunguseng Dojang (Inseong Hwang))
- UI
  - Goban Component
    - [x] Stone placement
    - [x] Stone deletion
    - [x] Move numbering
    - Game Rules
      - [ ] Capture
      - [ ] Suicide
      - [ ] Ko
  - Filters
    - [x] Sequential
    - [x] Stone-based (for edited stones)
    - [ ] Region-based
    - Stone-based filtering
      - [ ] Contains only selected stones
      - [ ] Contains selected stones
  - [x] URL-based filtering for the search
  - [ ] Regular-search, such as player name, date, etc.
  - [ ] Add text/move-comment search.

### 1.2. Ideas

- [x] Test it with GoGoD Games
  - Seems to work fine with it, it takes a couple of seconds once you get to 1,000s of games, but I think that might be fixed with some caching.
- [ ] Include [Yunguseng Dojang](https://yunguseng.com/)'s files so we can index their large library.
  - There's something weird about this. There's something strange about the parsing of his files, such that they get bloated and overflow Neo4j's memory???
    - The same thing is happening for adding the tsumego collection.
- [ ] Webscrape [101 Weiqi](https://www.101weiqi.com/) for its tsumegos.

## 2. Dev Setup

1. Open Neo4j Desktop, and create a new project.
2. Launch the Neo4j server.
3. Create a new user with admin privileges, which will be used in the environment variables.
4. Update the environment variables accordingly.
5. Launch the NextJS project.

### 2.1. Tech Stack

- Neo4j (Graph DBMS)
- NextJS (ReactJS) + MUI
- Sabaki's SGF Parser
- Custom Go Board HTML Canvas Component

### 2.2. Environment Variables

#### 2.2.1. `.env`

```env
NEXTJS_PORT=
```

#### 2.2.1. `.env.local`

```env
PORT=

NEO4J_PORT=
NEO4J_USER=
NEO4J_PASSWORD=
```

## 3. References

### 3.1. Pattern Search

- [Waltheri's Go Pattern Search](http://ps.waltheri.net/)
- [Waltheri on Github](https://github.com/waltheri)
  - [Waltheri's List of Go Libraries and Resources](https://github.com/waltheri/go-libraries)

### 3.2 Board Editor

- [Sabaki's Board Editor: Shudan](https://github.com/SabakiHQ/Shudan)
  - [Trying to Make Shudan Work With NextJS](https://github.com/SabakiHQ/Shudan/issues/1#issuecomment-1820779837)
- [WGo.js](http://wgo.waltheri.net/): the editor used in Waltheri's Pattern Search.

### 3.3. SGF

- [Sabaki's SGF Parser](https://github.com/SabakiHQ/sgf)
- [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
  - [Alternative SGF Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)

### 3.4. Related Questions on Stack Overflow

- [How to Recursively Create a Tree with Cypher (Neo4j)](https://stackoverflow.com/q/77495108/4756173)
- [How to (Efficiently) Find Subpaths in Recursive Trees through Cypher (Graph vs Regex)](https://stackoverflow.com/q/77497411/4756173)

### 3.5. Miscellanea

- [Graphology](https://github.com/graphology/graphology): a JS package for dealing with graphs.
- For editing Cypher code as strings with syntax highlighting on VS Code, I'm using the following extensions:
  - [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html)
  - [Anthony Gatlin - Cypher Query Language Tools for Neoj](https://marketplace.visualstudio.com/items?itemName=AnthonyJGatlin.vscode-cypher-query-language-tools)
- [101 Weiqi](https://www.101weiqi.com/): Chinese website with various types of Go content. Probably the biggest tsumego database (pros create and transcribe tsumegos everyday).
- [Yunguseng Dojang](https://yunguseng.com/): In-seong Hwang 8d's online school, with extensive not-yet-index content.
