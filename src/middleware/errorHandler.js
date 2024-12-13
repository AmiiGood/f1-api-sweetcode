class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

const f1Errors = {
  400: {
    title: "Bad Request",
    event: "Massa's Disastrous Pit Stop (Singapore 2008)",
    message:
      "Like when Massa left the pit with the fuel hose attached. Your request is poorly connected.",
  },
  401: {
    title: "Unauthorized",
    event: "Michael Schumacher's Disqualification (1997)",
    message:
      "Like when Schumacher was disqualified from the 1997 championship. You're not authorized for this action.",
  },
  403: {
    title: "Forbidden",
    event: "Ferrari Team Orders (Austria 2002)",
    message:
      "Like when Barrichello had to let Schumacher pass. You don't have permission to access this resource.",
  },
  404: {
    title: "Not Found",
    event: "Glock in Brazil 2008",
    message:
      "Like when Hamilton couldn't find Glock on the last lap. We couldn't find the driver you're looking for.",
  },
  406: {
    title: "Not Acceptable",
    event: "Ricciardo's Shoe Celebration (Monza 2021)",
    message:
      "Like drinking from a shoe isn't for everyone, the server can't accept your request as it is.",
  },
  408: {
    title: "Request Timeout",
    event: "Mercedes' Endless Pit Stop (Monaco 2021)",
    message:
      "Like Bottas' never-ending pit stop in Monaco. The request took too long to complete.",
  },
  410: {
    title: "Gone",
    event: "Hülkenberg's Podium Dreams (Forever)",
    message:
      "Like Hülkenberg's elusive podium, the resource you’re looking for is gone forever.",
  },
  418: {
    title: "I'm a Teapot",
    event: "Kimi’s 'Leave Me Alone' Radio Moment",
    message: "Like Kimi doesn't want instructions, I'm a teapot, not a server.",
  },
  429: {
    title: "Too Many Requests",
    event: "DRS Overload",
    message:
      "Like when DRS activates too many times per lap. You're making too many requests.",
  },
  451: {
    title: "Unavailable for Legal Reasons",
    event: "Spygate Scandal (2007)",
    message:
      "Like McLaren's data controversy, this resource is unavailable for legal reasons.",
  },
  500: {
    title: "Internal Server Error",
    event: "McLaren Honda Engine (2015-2017)",
    message: "Like the McLaren-Honda era. We're having internal power issues.",
  },
  502: {
    title: "Bad Gateway",
    event: "Red Bull's Renault Engine Woes (2015)",
    message:
      "Like when Red Bull had unreliable power units. There's a communication breakdown.",
  },
  503: {
    title: "Service Unavailable",
    event: "Belgian GP 2021",
    message:
      "Like the 2021 Spa GP. The service is currently unavailable due to conditions.",
  },
  504: {
    title: "Gateway Timeout",
    event: "Senna's Retirement (Monaco 1988)",
    message:
      "Like when Senna stopped unexpectedly at Monaco. The server didn't respond in time.",
  },
};

const f1ErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // Handle specific Mongoose/MongoDB errors
  if (err.name === "CastError") {
    err = new AppError(400, "Invalid driver ID");
  }
  if (err.name === "ValidationError") {
    err = new AppError(400, "Invalid driver data");
  }

  // Get F1-themed error message
  const f1Error = f1Errors[err.statusCode] || f1Errors[500];

  // Build the response
  const response = {
    status: err.status || "error",
    error: {
      code: err.statusCode,
      title: f1Error.title,
      event: f1Error.event,
      message: f1Error.message,
      detail: err.message,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production error response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Unknown or programming error
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};

module.exports = {
  AppError,
  f1ErrorHandler,
  errorHandler,
};
