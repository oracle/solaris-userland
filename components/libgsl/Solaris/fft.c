/*
 * This code is inspired by example in:
 * https://www.gnu.org/software/gsl/doc/html/fft.html
 * and is intended to test underlaying arithetic for
 * cumulatine rounding errors
 */

#include <stdio.h>
#include <math.h>
#include <gsl/gsl_errno.h>
#include <gsl/gsl_fft_complex.h>

#define REAL(z,i) ((z)[2*(i)])
#define IMAG(z,i) ((z)[2*(i)+1])

int
main (void) {
  int i;
  double data[2*8192];
  double min = 0., max = 0.;

  /* create unit pulse */
  for (i = 0; i < 4096; i++) {
       REAL(data,i) = 0.0; IMAG(data,i) = 0.0;
  }
  for (; i < 8192; i++) {
       REAL(data,i) = 1.0; IMAG(data,i) = 0.0;
  }

  /* forward FFT */
  gsl_fft_complex_radix2_forward (data, 1, 8192);

  /* reverse FFT */
  gsl_fft_complex_radix2_forward (data, 1, 8192);

  for (i = 0; i < 8192; i++) {
      double val = IMAG(data,i);
      printf ("%e  ", val);
      if (val > max) max = val;
      if (val < min) min = val;
  }
  printf ("\n max:  %e\n", max);
  printf (" min: %e\n", min);

  return 0;
}
