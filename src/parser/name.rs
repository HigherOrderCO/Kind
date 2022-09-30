use hvm::parser;

fn is_letter(chr: char) -> bool {
  chr.is_ascii_alphanumeric() || chr == '_' || chr == '.' || chr == '$'
}

/// Parses a name right after the parsing cursor.
fn name_here(state: parser::State) -> parser::Answer<String> {
  let mut name: String = String::new();
  let mut state = state;
  let mut already_seen_slash = false;
  while let Some(got) = parser::head(state) {
    if is_letter(got) || (got == '/' && !already_seen_slash) {
      if got == '/' {
        already_seen_slash = true;
      }
      name.push(got);
      state = parser::tail(state);
    } else {
      if got == '/' {
        return parser::expected("name", 1, state);
      }
      break;
    }
  }
  Ok((state, name))
}
/// Parses a name after skipping comments and whitespace.
fn name(state: parser::State) -> parser::Answer<String> {
  let (state, _) = parser::skip(state)?;
  name_here(state)
}

pub fn parse_path_str(state: parser::State) -> parser::Answer<String> {
  let (state, name1) = name(state)?;
  if !name1.is_empty() || name1 == "/" {
    Ok((state, name1))
  } else {
    parser::expected("name", 1, state)
  }
}