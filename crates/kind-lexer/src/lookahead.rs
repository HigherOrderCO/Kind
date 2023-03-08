//! The lookhead structure is a wrapper around an iterator that allows
//! peeking at the next element without consuming it. It is used to
//! implement the lookahead feature of the lexer.
use std::collections::VecDeque;

/// A lookahead iterator that allows peeking at the next element.
pub struct Lookhead<I: Iterator, const CAPACITY: usize> {
    iter: I,
    queue: VecDeque<Option<I::Item>>,
}

impl<I: Iterator, const CAPACITY: usize> Lookhead<I, CAPACITY> {
    pub fn new(mut iter: I) -> Self {
        let mut queue = VecDeque::with_capacity(CAPACITY);

        for _ in 0..CAPACITY {
            queue.push_back(iter.next())
        }

        Self { iter, queue }
    }

    pub fn peek(&self, place: usize) -> &I::Item {
        self.queue[place].as_ref().unwrap()
    }
}

impl<I: Iterator, const CAPACITY: usize> Iterator for Lookhead<I, CAPACITY> {
    type Item = I::Item;

    fn next(&mut self) -> Option<Self::Item> {
        let result = self.queue.pop_front();
        self.queue.push_back(self.iter.next());
        result.flatten()
    }
}
