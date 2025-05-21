# German & Austrian Citizenship Eligibility Checker

A gamified, mobile-friendly web tool that helps users determine if they are eligible for German or Austrian citizenship based on their Jewish ancestry under historical persecution laws.

## Features

- Multi-step questionnaire flow
- Eligibility assessment for:
  - German citizenship (§116, §15, §5)
  - Austrian citizenship (§58c)
- Mobile-first, responsive design
- Contact form for lead generation
- CRM integration ready

## Tech Stack

- React with TypeScript
- Chakra UI for styling
- React Router for navigation
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── types/         # TypeScript type definitions
  ├── questions/     # Question data and logic
  ├── hooks/         # Custom React hooks
  └── utils/         # Utility functions
```

## CRM Integration

The application is set up to send form submissions to a CRM system. To integrate with your CRM:

1. Update the API endpoint in the ContactForm component
2. Modify the payload structure to match your CRM's requirements
3. Add any necessary authentication headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
