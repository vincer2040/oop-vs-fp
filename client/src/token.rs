
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Token {
    Illegal,
    BulkType,
    ArrayType,
    Retcar,
    Newl,
    Eof,
    Len(std::rc::Rc<str>),
    Bulk(std::rc::Rc<str>),
    Simple(std::rc::Rc<str>),
    Error(std::rc::Rc<str>),
}
