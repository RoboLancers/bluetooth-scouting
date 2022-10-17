import { PrismaClient } from "@prisma/client";
import express from "express";

class ApplicationService {
  constructor(routerOptions, dbOptions) {
    this.router = express.Router(routerOptions);

    this.app = express();
    this.app.use(express.json());
    this.app.use(this.router);

    this.db = new PrismaClient(dbOptions);
  }

  bootstrap() {
    this.app.listen(8080, () => console.log("\nRunning Lancer Scout Server\n"));
  }

  static async getForms(req, res) {
    try {
      const forms = await this.db.form.findMany({ where: req.body });

      res.json({
        success: true,
        forms,
      });
    } catch (error) {
      res.json({
        success: false,
        error,
      });
    }
  }

  static async uploadForms(req, res) {
    try {
      const forms = await this.db.form.create({
        data: {
          ...forms,
        },
      });
      res.json({
        success: true,
        forms,
      });
    } catch (error) {
      res.json({
        success: false,
        error,
      });
    }
  }

  //   ------------------

  // Leaving this here though I do not see its relevancy
  upsertForms(forms) {
    try {
      this.uploadHelper(0, forms);
    } catch (error) {
      console.error(error);
    }
  }
  // Helper function (Matt's code)
  uploadHelper(index, forms) {
    if (index < forms.length) {
      this.db.form
        .upsert({
          where: { id: forms[index].id },
          update: forms[index],
          create: forms[index],
        })
        .then(() => {
          this.uploadHelper(index + 1);
        });
    }
  }
}

export default ApplicationService