/* C++ Game of Life implementation for any mode for which mode set
   and draw pixel functions can be provided. The cellmap stores the
   neighbor count for each cell as well as the state of each cell;
   this allows very fast next-state determination. Edges always wrap
   in this implementation.
   Tested with Borland C++. To run, link with Listing 17.2
   in the large model. */
#include <stdlib.h>
#include <stdio.h>
// #include <iostream.h>
// #include <conio.h>
#include <time.h>
// #include <dos.h>
// #include <bios.h>
// #include <mem.h>

#define ON_COLOR  15       // on-cell pixel color
#define OFF_COLOR 0        // off-cell pixel color
#define MSG_LINE  10       // row for text messages
#define GENERATION_LINE 12 // row for generation # display
#define LIMIT_18_HZ  0     // set 1 to to maximum frame rate = 18Hz

class cellmap {
private:
   unsigned char *cells;
   unsigned char *temp_cells;
   unsigned int width;
   unsigned int height;
   unsigned int length_in_bytes;
public:
   cellmap(unsigned int h, unsigned int v);
   ~cellmap(void);
   void set_cell(unsigned int x, unsigned int y);
   void clear_cell(unsigned int x, unsigned int y);
   int cell_state(int x, int y);
   int count_neighbors(int x, int y);
   void next_generation(void);
   void init(void);
};

extern void enter_display_mode(void);
extern void exit_display_mode(void);
extern void draw_pixel(unsigned int X, unsigned int Y,
   unsigned int Color);
extern void show_text(int x, int y, char *text);

/* Controls the size of the cell map. Must be within the capabilities
   of the display mode, and must be limited to leave room for text
   display at right. */
unsigned int cellmap_width = 96;
unsigned int cellmap_height = 96;

/* Width & height in pixels of each cell. */
unsigned int magnifier = 2;

/* Randomizing seed */
unsigned int seed;

void main()
{
   unsigned long generation = 0;
   char gen_text[80];
   long bios_time, start_bios_time;

   cellmap current_map(cellmap_height, cellmap_width);

   current_map.init();  // randomly initialize cell map

   enter_display_mode();

   // Keep recalculating and redisplaying generations until any key
   // is pressed
   show_text(0, MSG_LINE, "Generation: ");
   start_bios_time = _bios_timeofday(_TIME_GETCLOCK, &bios_time);
   do {
      generation++;
      sprintf(gen_text, "%10lu", generation);
      show_text(1, GENERATION_LINE, gen_text);
      // Recalculate and draw the next generation
      current_map.next_generation();
#if LIMIT_18_HZ
      // Limit to a maximum of 18.2 frames per second, for visibility
      do {
         _bios_timeofday(_TIME_GETCLOCK, &bios_time);
      } while (start_bios_time == bios_time);
      start_bios_time = bios_time;
#endif
   } while (!kbhit());

   getch();    // clear keypress
   exit_display_mode();
   cout << "Total generations: " << generation << "\nSeed: " <<
         seed << "\n";
}

/* cellmap constructor. */
cellmap::cellmap(unsigned int h, unsigned int w)
{
   width = w;
   height = h;
   length_in_bytes = w * h;
   cells = new unsigned char[length_in_bytes];  // cell storage
   temp_cells = new unsigned char[length_in_bytes]; // temp cell storage
   if ( (cells == NULL) || (temp_cells == NULL) ) {
      printf("Out of memory\n");
      exit(1);
   }
   memset(cells, 0, length_in_bytes);  // clear all cells, to start
}

/* cellmap destructor. */
cellmap::~cellmap(void)
{
   delete[] cells;
   delete[] temp_cells;
}

/* Turns an off-cell on, incrementing the on-neighbor count for the
   eight neighboring cells. */
void cellmap::set_cell(unsigned int x, unsigned int y)
{
   unsigned int w = width, h = height;
   int xoleft, xoright, yoabove, yobelow;
   unsigned char *cell_ptr = cells + (y * w) + x;

   // Calculate the offsets to the eight neighboring cells,
   // accounting for wrapping around at the edges of the cell map
   if (x == 0)
      xoleft = w - 1;
   else
      xoleft = -1;
   if (y == 0)
      yoabove = length_in_bytes - w;
   else
      yoabove = -w;
   if (x == (w - 1))
      xoright = -(w - 1);
   else
      xoright = 1;
   if (y == (h - 1))
      yobelow = -(length_in_bytes - w);
   else
      yobelow = w;

   *(cell_ptr) |= 0x01;
   *(cell_ptr + yoabove + xoleft) += 2;
   *(cell_ptr + yoabove) += 2;
   *(cell_ptr + yoabove + xoright) += 2;
   *(cell_ptr + xoleft) += 2;
   *(cell_ptr + xoright) += 2;
   *(cell_ptr + yobelow + xoleft) += 2;
   *(cell_ptr + yobelow) += 2;
   *(cell_ptr + yobelow + xoright) += 2;
}

/* Turns an on-cell off, decrementing the on-neighbor count for the
   eight neighboring cells. */
void cellmap::clear_cell(unsigned int x, unsigned int y)
{
   unsigned int w = width, h = height;
   int xoleft, xoright, yoabove, yobelow;
   unsigned char *cell_ptr = cells + (y * w) + x;

   // Calculate the offsets to the eight neighboring cells,
   // accounting for wrapping around at the edges of the cell map
   if (x == 0)
      xoleft = w - 1;
   else
      xoleft = -1;
   if (y == 0)
      yoabove = length_in_bytes - w;
   else
      yoabove = -w;
   if (x == (w - 1))
      xoright = -(w - 1);
   else
      xoright = 1;
   if (y == (h - 1))
      yobelow = -(length_in_bytes - w);
   else
      yobelow = w;

   *(cell_ptr) &= ~0x01;
   *(cell_ptr + yoabove + xoleft) -= 2;
   *(cell_ptr + yoabove ) -= 2;
   *(cell_ptr + yoabove + xoright) -= 2;
   *(cell_ptr + xoleft) -= 2;
   *(cell_ptr + xoright) -= 2;
   *(cell_ptr + yobelow + xoleft) -= 2;
   *(cell_ptr + yobelow) -= 2;
   *(cell_ptr + yobelow + xoright) -= 2;
}

/* Returns cell state (1=on or 0=off). */
int cellmap::cell_state(int x, int y)
{
   unsigned char *cell_ptr;

   cell_ptr = cells + (y * width) + x;
   return *cell_ptr & 0x01;
}

/* Calculates and displays the next generation of current_map */
void cellmap::next_generation()
{
   unsigned int x, y, count;
   unsigned int h = height, w = width;
   unsigned char *cell_ptr, *row_cell_ptr;

   // Copy to temp map, so we can have an unaltered version from
   // which to work
   memcpy(temp_cells, cells, length_in_bytes);

   // Process all cells in the current cell map
   cell_ptr = temp_cells;     // first cell in cell map
   for (y=0; y<h; y++) {      // repeat for each row of cells
   // Process all cells in the current row of the cell map
      x = 0;
      do {        // repeat for each cell in row
                  // Zip quickly through as many off-cells with no
                  // neighbors as possible
         while (*cell_ptr == 0) {
            cell_ptr++; // advance to the next cell
            if (++x >= w) goto RowDone;
         }
         // Found a cell that's either on or has on-neighbors,
         // so see if its state needs to be changed
         count = *cell_ptr >> 1; // # of neighboring on-cells
         if (*cell_ptr & 0x01) {
            // Cell is on; turn it off if it doesn't have
            // 2 or 3 neighbors
            if ((count != 2) && (count != 3)) {
               clear_cell(x, y);
               draw_pixel(x, y, OFF_COLOR);
            }
         } else {
            // Cell is off; turn it on if it has exactly 3 neighbors
            if (count == 3) {
               set_cell(x, y);
               draw_pixel(x, y, ON_COLOR);
            }
         }
         // Advance to the next cell
         cell_ptr++; // advance to the next cell byte
      } while (++x < w);
RowDone:
   }
}

/* Randomly initializes the cellmap to about 50% on-pixels. */
void cellmap::init()
{
   unsigned int x, y, init_length;

   // Get the seed; seed randomly if 0 entered
   cout << "Seed (0 for random seed): ";
   cin >> seed;
   if (seed == 0) seed = (unsigned) time(NULL);

   // Randomly initialize the initial cell map to 50% on-pixels
   // (actually generally fewer, because some coordinates will be
   // randomly selected more than once)
   cout << "Initializing...";
   srand(seed);
   init_length = (height * width) / 2;
   do {
      x = random(width);
      y = random(height);
      if (cell_state(x, y) == 0) {
         set_cell(x, y);
      }
   } while (--init_length);
}