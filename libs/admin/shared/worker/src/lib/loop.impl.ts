export const impl = {
  loop(payload: number): string {
    for (let i = 1; i <= payload; i++) {
      console.log(`${i}回目`);
    }
    return 'finished';
  },

  test(a: string): string {
    return a;
  },
};
