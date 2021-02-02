use std::any;
use std::error::Error;

use log::warn;

use crate::commands::factory::{RespondingCommand, SilentCommand};

pub struct SilentCommandsLoggerDecorator<T: SilentCommand> {
    pub command: T,
}

impl<T: SilentCommand> SilentCommand for SilentCommandsLoggerDecorator<T> {
    fn exec(self) -> Option<Box<dyn Error>> {
        let t_name = type_name(&self.command);
        let res = self.command.exec();
        if let Some(err) = &res {
            warn!("Unable to execute silent command ({}): {}", t_name, err);
        }

        res
    }
}

pub struct RespondingCommandLoggerDecorator<T> {
    pub command: Box<dyn RespondingCommand<T>>,
}

impl<T> RespondingCommand<T> for RespondingCommandLoggerDecorator<T> {
    fn exec(&self) -> Result<T, Box<dyn Error>> {
        let t_name = type_name(&self.command);
        let res = self.command.exec();
        if let Err(err) = &res {
            warn!("Unable to execute responding command ({}): {}", t_name, err);
        }

        res
    }
}

fn type_name<T>(_: T) -> String {
    any::type_name::<T>().to_string()
}
