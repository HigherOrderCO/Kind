use std::marker::PhantomData;

pub struct Is<A, B>(PhantomData<A>, PhantomData<B>);

pub fn refl<A, B>() -> Is<A, B> {
    Is(PhantomData, PhantomData)
}
