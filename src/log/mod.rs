use tracing::subscriber::SetGlobalDefaultError;

pub fn init_logger(logger: &str) -> Result<(), SetGlobalDefaultError> {
    let subscriber = tracing_subscriber::FmtSubscriber::builder()
        .with_env_filter(logger)
        .finish();

    tracing::subscriber::set_global_default(subscriber)
}
