pub trait FileReader {
    fn read_file(&self, name: &str);
}

pub trait FileWriter {
    fn write_file(&self, name: &str);
}

pub trait FileIO : FileReader + FileWriter { }

