/// A sequence of arguments that depends on the previous sequence
/// it's similar to a iterated sigma type.
#[derive(Debug, Clone, Hash, PartialEq, Eq)]
pub struct Telescope<T>(Vec<T>);

impl<T> Default for Telescope<T> {
    fn default() -> Self {
        Self(Default::default())
    }
}

impl<T> Telescope<T> {
    pub fn new(vec: Vec<T>) -> Telescope<T> {
        Telescope(vec)
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn push(&mut self, el: T) {
        self.0.push(el)
    }

    pub fn as_slice(&self) -> &[T] {
        self.0.as_slice()
    }

    pub fn to_vec(self) -> Vec<T> {
        self.0
    }

    pub fn get_vec(&mut self) -> &mut Vec<T> {
        &mut self.0
    }

    pub fn extend(&self, other: &Telescope<T>) -> Telescope<T>
    where
        T: Clone,
    {
        Telescope([self.as_slice(), other.as_slice()].concat())
    }

    pub fn map<B, F>(&self, f: F) -> Telescope<B>
    where
        F: FnMut(&T) -> B,
    {
        Telescope(self.0.iter().map(f).collect())
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn iter(&self) -> std::slice::Iter<T> {
        self.0.iter()
    }

    pub fn iter_mut(&mut self) -> std::slice::IterMut<T> {
        self.0.iter_mut()
    }
}

impl<T> Telescope<T>
where
    T: Clone,
{
    pub fn drop(self, num: usize) -> Telescope<T> {
        Telescope(self.0[num..].to_vec())
    }
}

impl<A> IntoIterator for Telescope<A> {
    type Item = A;

    type IntoIter = std::vec::IntoIter<A>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<A> std::ops::Index<usize> for Telescope<A> {
    type Output = A;

    fn index(&self, index: usize) -> &Self::Output {
        &self.0[index]
    }
}