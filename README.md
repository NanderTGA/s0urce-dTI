# s0urce-dTI

All of d0t's statistics for items in s0urce.io, now in an easy-to-use library.

## Contributing

After cloning, run `pnpm install`.
[Pnpm](https://pnpm.io) is a more efficient package manager for Node.js.
If you don't have it installed already, try running `corepack install` first.
If that doesn't, work, follow [the installation instructions on their website](https://pnpm.io/installation) and restart your IDE.

### TODO

- Refactor dCPS code
- Include new dCPS in getItemGrade()
- Test if everything actually works (setup vitest?)
- Publish to NPM
  - Set a proper list of exported files in package.json
  - Setup github actions workflow for that
  - JSR too? in the end this is just a bunch of math so can't hurt
- Create a better API interface that works for both prettier-s0urce and bots
- Move repo to @d0t3k1

### Git LFS

If you're working with binary filetypes, like images, videos, excel files, files that are excessively large that you aren't planning on changing or other files that don't work well with version control, you should use Git LFS to track them. Do note that CSV files are plain text files and can work fine with git. One may however consider using Git LFS if the file is excessively large and doesn't need to be changed (git lfs still allows files to be changed, but comparing differences between versions won't work on LFS-tracked files).

Check if the filetype is listed in `.gitattributes`. If it isn't, run this command: `git lfs track "*.png"` (replace png with the relevant file extension).
You can also add a specific large file into git LFS like this: `git lfs track --filename "rainbowTable.txt"`

NOTE: If you run these commands only after a relevant file is already checked into git, you should run `git lfs migrate`. More info on the [Git LFS website](https://git-lfs.com/).

## License

This library is licensed under the GNU General Public License Version 3 (GPLv3). This means that closed-source bots can use it too since their code isn't distributed.

The code in this library was derived from the dTI code in prettier-s0urce, developed by Xen0o2 and d0t (see [Xen0o2's version](github.com/Xen0o2/prettier-s0urce) and [d0t's version](https://github.com/d0t3k1/d0t-s0urce-prettier)).
The API interface was derived from the dTI implementation in NanderTGA's Yabluzo, which was also derived from prettier-s0urce.
