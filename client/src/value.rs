
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Value {
    Invalid,
    Simple(std::rc::Rc<str>),
    BulkString(std::rc::Rc<str>),
    Error(std::rc::Rc<str>),
    Array(Vec<Value>),
}
