# Asset Management System

A Vue.js-based Industrial Automation Asset Management System that helps manage clients, projects, control cabinets, manufacturers, computer workstations, automation products, and software licenses.

## Features

- User Authentication with Role-Based Access Control
- Dashboard with key metrics
- Client Management
- Project Management
- Control Cabinet Management
- Manufacturer Management
- Computer Workstation Management
- Automation Product Management
- Software License Management
- Reporting

## User Roles & Permissions

The system supports two user roles, each with specific permissions and navigation visibility:

### Admin
- Full access to all modules and records
- Can view, add, edit, and delete all entities
- Can manage users (create, edit, delete, assign roles)
- Sees all navigation menu items, including User Management

### Company
- Access limited to their own company's data
- Can view, add, edit, and delete records for:
  - Clients
  - Projects
  - Control Cabinets
  - Manufacturers
  - Automation Products
  - Computer Workstations
  - Software
  - Reports
- Cannot access User Management
- Navigation menu hides User Management

## Navigation Menu

The sidebar navigation adapts based on the logged-in user's role:
- **Admin**: Sees all modules, including User Management
- **Company**: Sees only business modules (no User Management)

## Login Credentials (for testing)

- **Admin**
  - Email: `admin@example.com`
  - Password: any
- **Company**
  - Email: `company@example.com`
  - Password: any

## Notes
- The navigation and module access are dynamically controlled using the user's role and permissions.
- For further customization, see `src/stores/auth.js` and `src/App.vue`.

## Tech Stack

- Vue.js 3 (Options API)
- Element Plus UI Library
- Pinia for State Management
- Vue Router for Navigation
- JavaScript

## Project Structure

```
asset-management-system-vue/
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── components/
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── clients.js
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── HomeView.vue
│   │   ├── ClientsView.vue
│   │   ├── ProjectsView.vue
│   │   ├── ControlCabinetsView.vue
│   │   ├── ManufacturersView.vue
│   │   ├── ComputerWorkstationsView.vue
│   │   ├── AutomationProductsView.vue
│   │   ├── SoftwareView.vue
│   │   └── ReportsView.vue
│   ├── App.vue
│   └── main.js
├── .env
├── package.json
└── README.md
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Build

To build the project for production:

```bash
npm run build
```

## Testing

To run tests:

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
