# Technology Scouting Frontend

React-based frontend application for the Technology Scouting platform, connecting universities with businesses.

## Available Scripts

The following npm scripts are available for development:

### Development Server

```bash
npm start
```

- Starts the development server
- Opens [http://localhost:3000](http://localhost:3000) in your browser
- Enables hot reload for file changes
- Shows lint errors in the console

### Testing

```bash
npm test
```

- Launches the test runner in watch mode
- Runs tests interactively
- For more details, see [running tests](https://facebook.github.io/create-react-app/docs/running-tests)

### Production Build

```bash
npm run build
```

- Creates optimized production build in `build/` folder
- Bundles and minifies React in production mode
- Adds content hashes to filenames
- Ready for deployment
- See [deployment guide](https://facebook.github.io/create-react-app/docs/deployment)

## Project Structure

The project follows a standard React application structure:

- `index.tsx`: The entry point of the application, where the React setup is done.
- `App.tsx`: The main component that serves as the entry point for the application's component tree.
- `components/`: Contains all the React components used in the application. Each component is typically placed in its own file.
- `logic/`: Includes all the application logic, such as complex computations, data manipulation, and communication with the backend API.
- `styles/`: Contains CSS files for styling the components. Each component's styles are usually placed in a separate file with a matching name.
