const connection = require('../database/connection');
const { DateTime } = require('luxon');
/** Get all Products */
const getSolandCat = async (req, res)=>{
    let display = [];
    try {
         // Fetch data from the institutional database
         const institutionalQuery = `SELECT * FROM ayh_institutional`;
         const institutionalResults = await executeQuery(institutionalQuery);
 
         // Fetch data from the branded database
         const brandedQuery = `SELECT * FROM ayh_branded`;
         const brandedResults = await executeQuery(brandedQuery);
 
         // Process and combine data from both databases
         institutionalResults.forEach((row) => {
             const data = {
                 Business_solutions: row.Business_solutions,
                 Product_Category: row.Product_Category,
             };
             display.push(data);
         });
 
         brandedResults.forEach((row) => {
             const data = {
                 Business_solutions: row.Business_solutions,
                 Product_Category: row.Product_Category,
             };
             display.push(data);
         });
 
        res.json(display);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};
const getProducts = async (req, res)=>{
    try {
        const query = `SELECT * FROM ayh_institutional`;
        const results = await executeQuery(query);
        // console.log('Products retrieved successfully.');
        res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};
/** Function to execute SQL queries / get all products*/
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
const getProductMaster = async (req, res)=>{
    const selectedGroupCategory = req.query.category;
    console.log('group ', selectedGroupCategory)
    let database = '';
    if(selectedGroupCategory === 'INSTITUTIONAL'){
        database ='ayh_institutional';
    }else if (selectedGroupCategory === 'PRICE_GROUP'){
        database = 'ayh_price_group';
    }
    else if (selectedGroupCategory === 'BRANDED'){
        database = 'ayh_branded';
    }
    try {
        const query = `SELECT * FROM ${database}`;
        const results = await executeQuery(query);
        // console.log('Products retrieved successfully.');
        res.json(results);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while retrieving the products.');
      }
};
/** Function to execute SQL queries / get all products*/
function executeQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};


/** Get Products with certain product code */
const getProduct = async (req, res) => {
    const selectedProductCategory = req.query.productCategory;
    const categoryGroup = req.query.categoryGroup;
    const solution = req.query.solution
    const customer = req.query.customer;
    console.log(selectedProductCategory, solution)
    let database = '';
    let selectQuery = '';

    /**fetching record for institutional */
    if (categoryGroup === 'INSTITUTIONAL') {
        database = 'ayh_institutional';
        selectQuery = `SELECT * FROM ${database} `;
        if (solution !== '' && selectedProductCategory !== '') {
            // Use the actual values if they are not null
            selectQuery += ` WHERE Business_solutions = '${solution}' AND Product_Category = '${selectedProductCategory}'`;   
        }
        try {
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    res.json(results);
                    // console.log(results)
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }

        /**fetching record for price group */ 
    }else if (categoryGroup === 'PRICE_GROUP') {
        database = 'ayh_price_group';
        selectQuery = `SELECT * FROM ${database} WHERE 1 = 1 `;
        const queryParams = [];
        if(customer){
            selectQuery += `AND ACCOUNTRELATION IN (?) `;
            queryParams.push(customer);
        }
        try {
            connection.query(selectQuery, queryParams, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    res.json(results);
                    // console.log(results)
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }else if (categoryGroup === 'BRANDED') {
        database = 'ayh_branded';

        selectQuery = `SELECT * FROM ${database} `;

        if (solution !== '' && selectedProductCategory !== '') {
            // Use the actual values if they are not null
            selectQuery += ` WHERE Business_solutions = '${solution}' AND Product_Category = '${selectedProductCategory}'`;   
        }
        try {
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    res.json(results);
                    // console.log(results)
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
    // const selectQuery1 = `SELECT * FROM ${database} WHERE Business_solutions = '${solution}' AND Product_Category = '${selectedProductCategory}';`;  
    // const selectQuery2 = `SELECT * FROM ${database}`; 
    // let selectQuery = '';
    // if(solution !== null || selectedProductCategory !== null){
    //     selectQuery = selectQuery1;
    // }else{
    //     selectQuery = selectQuery2;
    // }
   
            // else if (solution !== '') {
            // // Add only the Business_solutions condition if selectedProductCategory is null
            // selectQuery += ` WHERE Business_solutions = '${solution}'`;
            // } else if (selectedProductCategory !== '') {
            // // Add only the Product_Category condition if solution is null
            // selectQuery += ` WHERE Product_Category = '${selectedProductCategory}'`;
            // }
    // console.log(selectQuery)
   
        // let selectQuery = `SELECT * FROM ${database} `;

      
       
            //   let query = `SELECT * FROM ayh_institutional WHERE 1 = 1 `;
            //  
            //   if(selectedProductCategory){
            //       query += `AND Product_Category IN (?) `;
            //       queryParams.push(selectedProductCategory);
            //   }
            // //   if(selectedCategory){
            // //     query += `AND product_group IN (?) `;
            // //     queryParams.push(selectedCategory);
            // // }
            //   
            
          
    
};
const getAXpriceGroup = async (req, res) =>{
    try{
        let selectQuery = `SELECT * FROM ayh_customer_ax`;
        connection.query(selectQuery, (error, results) => {
            if (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Failed to fetch products' });
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

/** Get Products with certain product code */
const getProductChanges = async (req, res) => {
    const categoryGroup = req.query.categoryGroup;
    const lastDownloadDatePriceGroup = req.query.lastDownloadDatePriceGroup;
    const lastDownloadDateInstitutional = req.query.lastDownloadDateInstitutional;
    const lastDownloadDateBranded = req.query.lastDownloadDateBranded;
    let lastDownloadDate = '';
    
    const currentDate = new Date(req.query.currentDate);
   

    let database = '';
    if (categoryGroup === 'INSTITUTIONAL') {
        database = 'ayh_institutional';
        lastDownloadDate = new Date(lastDownloadDateInstitutional);
    }else if (categoryGroup === 'PRICE_GROUP') {
        database = 'ayh_price_group';
        lastDownloadDate = new Date(lastDownloadDatePriceGroup);
    }else if (categoryGroup === 'BRANDED') {
        database = 'ayh_branded';
        lastDownloadDate = new Date(lastDownloadDateBranded);
    }
    const formattedLastDownloadDate = `${lastDownloadDate.getFullYear()}-${(lastDownloadDate.getMonth() + 1).toString().padStart(2, '0')}-${lastDownloadDate.getDate().toString().padStart(2, '0')} ${lastDownloadDate.getHours().toString().padStart(2, '0')}:${lastDownloadDate.getMinutes().toString().padStart(2, '0')}:${lastDownloadDate.getSeconds().toString().padStart(2, '0')}`;
    const formattedcurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

    try {
            const selectQuery = `SELECT * FROM ${database} WHERE Created_at BETWEEN '${formattedLastDownloadDate}' AND '${formattedcurrentDate}' OR  Updated_at BETWEEN '${formattedLastDownloadDate}' AND '${formattedcurrentDate}';`;
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    if(results.length > 0){
                        res.json(results);
                        console.log(results);
                    }else{
                        res.json({error: `No changes made since ${formattedLastDownloadDate}` });
                        console.log(selectQuery);
                    }  
                }
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    
};


/** Post a product into institutional */
const InsertNewProducts =  (req, res)=>{
  
  console.log(req.body)
  let values = [];
  let adjustedData = [];
  let newRecord = [];
    const { sol, cat,customers,
        group, beforeId, afterId, Business_Solution, Product_Category,
        itemid, itemName, size, config, color, style, um, description, 
        Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight
        // ,Effectivity_date_start, Effectivity_date_end
    } = req.body;
   
    let database = '';
    if (group === 'INSTITUTIONAL') {
        database = 'ayh_institutional';

        const { sol, cat,
            group, beforeId, afterId, Business_Solution, Product_Category,
            itemid, itemName, size, config, color, style, um, description, 
            Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight,
            DIST_05_VAT_EX_CASE, DIST_05_VAT_EX_UNIT, DIST_04_VAT_IN_CASE, DIST_04_VAT_IN_UNIT, 
            DEAL_05_VAT_EX_CASE, DEAL_05_VAT_EX_UNIT, DEAL_04_VAT_IN_CASE,DEAL_04_VAT_IN_UNIT,
            ENDU_05_VAT_EX_CASE, ENDU_05_VAT_EX_UNIT, ENDU_04_VAT_IN_CASE, ENDU_04_VAT_IN_UNIT
            // ,Effectivity_date_start, Effectivity_date_end
        } = req.body;
    
       const iRolls_Cs = !isNaN(Rolls_Cs) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
       const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
       const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
       const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
       const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
    
       const Product_key = itemid + config+ size + color + style;
                 newRecord = {
                  id: afterId, Business_solutions: Business_Solution, Product_Category :Product_Category, Product_unique_key: Product_key,
                  Product_Code: itemid, Item_Name: itemName, Config: config, Size: size, Color: color, Style: style, UM: um, Product_Description: description,
                  Grade: Grade, Rolls_Cs: iRolls_Cs, Pk_Case: iPk_Case, Rolls_Pk: iRolls_Pk, Sheets_Roll: iSheets_Roll, Ply: iPly, Standard_weight : Standard_weight,
                  DIST_05_VAT_EX_CASE: DIST_05_VAT_EX_CASE, DIST_05_VAT_EX_UNIT: DIST_05_VAT_EX_UNIT, DIST_04_VAT_IN_CASE: DIST_04_VAT_IN_CASE,
                  DIST_04_VAT_IN_UNIT: DIST_04_VAT_IN_UNIT, DEAL_05_VAT_EX_CASE: DEAL_05_VAT_EX_CASE, DEAL_05_VAT_EX_UNIT: DEAL_05_VAT_EX_UNIT,
                  DEAL_04_VAT_IN_CASE: DEAL_04_VAT_IN_CASE, DEAL_04_VAT_IN_UNIT: DEAL_04_VAT_IN_UNIT, ENDU_05_VAT_EX_CASE: ENDU_05_VAT_EX_CASE, 
                  ENDU_05_VAT_EX_UNIT: ENDU_05_VAT_EX_UNIT, ENDU_04_VAT_IN_CASE: ENDU_04_VAT_IN_CASE, ENDU_04_VAT_IN_UNIT: ENDU_04_VAT_IN_UNIT,
             
                   Created_at: new Date(), Updated_at: new Date()
                };
            
    }else if (group === 'PRICE_GROUP') {
        database = 'ayh_price_group';

        const { sol, cat,
            group, beforeId, afterId, accountRelation,
            itemid, itemName, size, config, color, style, um, description, 
            Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight, Price_case, Price_unit
           
            // ,Effectivity_date_start, Effectivity_date_end
        } = req.body;
    
       const iRolls_Cs = !isNaN(Rolls_Cs) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
       const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
       const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
       const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
       const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
       const iPrice_unit= !isNaN(Price_unit) && Price_unit !== '' ? parseInt(Price_unit) : null;
    
       const Product_key = accountRelation + itemid + config+ size + color + style;
        newRecord = {
            id: afterId, accountRelation: accountRelation, unique_key: Product_key,
            Product_Code: itemid, Item_Name: itemName, Config: config, Size: size, Color: color, Style: style, UM: um, Product_Description: description,
            Grade: Grade, Rolls_Cs: iRolls_Cs, Pk_Case: iPk_Case, Rolls_Pk: iRolls_Pk, Sheets_Roll: iSheets_Roll, Ply: iPly, Standard_weight : Standard_weight,
            Price_case: Price_case, Price_unit: iPrice_unit, Created_at: new Date(), Updated_at: new Date()
        };
                
    }else if (group === 'BRANDED') {
        database = 'ayh_branded';
        const { sol, cat,
            group, beforeId, afterId, Business_Solution, Product_Category,
            itemid, itemName, size, config, color, style, um, description, 
            Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply,Standard_weight,
            Bg_Cs, VATex, Distributor_Price, DP_Unit, 
            Margin, List_Price_Value, LP_Unit, Markup,
            SRP_Price_Cs, SRP
            // ,Effectivity_date_start, Effectivity_date_end
        } = req.body;
    
        const iRolls_Cs = !isNaN(Rolls_Cs) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
        const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
        const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
        const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
        const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
        const iVATex = !isNaN(VATex) && VATex !== '' ? parseFloat( VATex) : null;
        const iDistributor_Price =!isNaN(Distributor_Price) && Distributor_Price !== '' ? parseFloat(Distributor_Price) : null;
        const iDP_Unit = !isNaN(DP_Unit) && DP_Unit !== '' ? parseFloat(DP_Unit) : null;
        const iMargin = !isNaN(Margin) && Margin !== '' ? parseFloat(Margin) : null;
        const iList_Price_Value = !isNaN(List_Price_Value) && List_Price_Value !== '' ? parseFloat(List_Price_Value) : null;
        const iLP_Unit =  !isNaN(LP_Unit) && LP_Unit !== '' ? parseFloat(LP_Unit,) : null;
        const iMarkup = !isNaN(Markup) && Markup !== '' ? parseFloat( Markup) : null;
        const iSRP_Price_Cs =  !isNaN(SRP_Price_Cs) && SRP_Price_Cs !== '' ? parseFloat( SRP_Price_Cs) : null;
        const iSRP = !isNaN(SRP) && SRP !== '' ? parseFloat(SRP) : null;
        
      
        

    
       const Product_key = itemid + config+ size + color + style;
                 newRecord = {
                  id: afterId, Business_solutions: Business_Solution, Product_Category :Product_Category, Product_unique_key: Product_key,
                  Product_Code: itemid, Item_Name: itemName, Config: config, Size: size, Color: color, Style: style, UM: um, Product_Description: description,
                  Grade: Grade, Bg_Cs : Bg_Cs, Rolls_Cs: iRolls_Cs, Pk_Case: iPk_Case, Rolls_Pk: iRolls_Pk, Sheets_Roll: iSheets_Roll, Ply: iPly, Standard_weight:Standard_weight,
                  VATex : iVATex, Distributor_Price : iDistributor_Price, DP_Unit : iDP_Unit, Margin : iMargin, List_Price_Value : iList_Price_Value,
                  LP_Unit : iLP_Unit, Markup : iMarkup, SRP_Price_Cs: iSRP_Price_Cs, SRP : iSRP,
                   Created_at: new Date(), Updated_at: new Date()
                };  
    }

    connection.query(`ALTER TABLE ${database} MODIFY COLUMN id INT;`, (error, results) => {
        if (error) {
            console.error('An error occurred while disabling auto-increment:', error);
            res.status(500).send('Error disabling auto-increment');
            return;
        }

        console.log('Disabled auto-increment for id column.');

        /** Update the id values greater than afterId to make space for the new record*/
        const updateQuery = `UPDATE ${database} SET id = id + 1 WHERE id >= ${afterId} ORDER BY id DESC`;
        connection.query(updateQuery, (error, results) => {
            if (error) {
                console.error('An error occurred while updating the id values:', error);
                return;
            }
     
        /**  Insert the new record to the desired id*/
            const insertQuery = `INSERT INTO ${database} SET ?`;
            connection.query(insertQuery, newRecord, (error, results) => {
                if (error) {
                    console.error('An error occurred while inserting the record:', error);
                    return;
                }

                /**  Set the auto-increment back on the id column  */ 
                connection.query(`ALTER TABLE ${database} MODIFY COLUMN id INT AUTO_INCREMENT;`, (error, results) => {
                    if (error) {
                        console.error('An error occurred while setting auto-increment back:', error);
                        res.status(500).send('Error enabling auto-increment');
                    } else {
                        console.log('Auto-increment set back on id column.');
                        // res.status(200).send('Data saved successfully');
                    }
                });
                if(group === 'INSTITUTIONAL'){
                    let selectQuery = `SELECT * FROM ${database}`;

                    if (sol !== '' && cat !== '') {
                    // Use the actual values if they are not null
                    selectQuery += ` WHERE Business_solutions = '${sol}' AND Product_Category = '${cat}'`;   
                    } 
                    // const selectQuery = `SELECT * FROM ayh_institutional WHERE Business_solutions = '${Business_Solution}' AND Product_Category = '${Product_Category}';`;
                    connection.query(selectQuery, (err, result) => {
                        if (err) {
                            console.error('Error fetching data ', err);
                            res.status(500).send('Fetching data Failed');
                        } else {
                            // console.log('Data successfully Retrieved');
                            // console.log('result ', result);
                            res.status(200).json(result); // Sending the result as JSON response
                        }
                    });
                };
                if(group === 'PRICE_GROUP'){
                    let selectQuery = `SELECT * FROM ${database}`;
                    const customersArray = JSON.parse(customers);

                    if (customersArray.length > 0) {
                        // Use the actual values if they are not empty
                        selectQuery += ` WHERE ACCOUNTRELATION IN ('${customersArray.join("', '")}')`;
                    }
            
                    connection.query(selectQuery, (err, results) => {
                        if (err) {
                            console.error('Error fetching data:', err);
                            res.status(500).send('An error occurred while retrieving the data.');
                        } else {
                            res.status(200).json(results); // Sending the result as JSON response
                        }
                    });
                };
                if(group === 'BRANDED'){
                    let selectQuery = `SELECT * FROM ${database}`;

                    if (sol !== '' && cat !== '') {
                    // Use the actual values if they are not null
                    selectQuery += ` WHERE Business_solutions = '${sol}' AND Product_Category = '${cat}'`;   
                    } 
                    // const selectQuery = `SELECT * FROM ayh_institutional WHERE Business_solutions = '${Business_Solution}' AND Product_Category = '${Product_Category}';`;
                    connection.query(selectQuery, (err, result) => {
                        if (err) {
                            console.error('Error fetching data ', err);
                            res.status(500).send('Fetching data Failed');
                        } else {
                            // console.log('Data successfully Retrieved');
                            // console.log('result ', result);
                            res.status(200).json(result); // Sending the result as JSON response
                        }
                    });
                };
            });
        });
    });
        
    
    console.log('Node.js Environment Timezone:', process.env.TZ);
/**------------------------------------------------------------------------------------------------- */

};
const NewProducts =  (req, res)=>{
  
    console.log(req.body)
    let values = [];
    let adjustedData = [];
    let newRecord = [];
      const {
          group, Business_Solution, Product_Category,
         
      } = req.body;
     
      let database = '';
      if (group === 'INSTITUTIONAL') {
          database = 'ayh_institutional';
  
          const {Business_Solution, Product_Category,
             
              // ,Effectivity_date_start, Effectivity_date_end
          } = req.body;
      
      
         
        newRecord = { Business_solutions: Business_Solution, Product_Category :Product_Category,
                Created_at: new Date(), Updated_at: new Date()
        };
              
      }else if (group === 'PRICE_GROUP') {
          database = 'ayh_price_group';
  
          const {accountRelation} = req.body;
      
        
        
          newRecord = {
             accountRelation: accountRelation
          };
                  
      }else if (group === 'BRANDED') {
          database = 'ayh_branded';
          const {group,  Business_Solution, Product_Category
          } = req.body;
      
        newRecord = { Business_solutions: Business_Solution, Product_Category :Product_Category, 
            Created_at: new Date(), Updated_at: new Date()
        };  
      }
  
    /**  Insert the new record to the desired id*/
              const insertQuery = `INSERT INTO ${database} SET ?`;
              connection.query(insertQuery, newRecord, (error, results) => {
                  if (error) {
                      console.error('An error occurred while inserting the record:', error);
                      return;
                  }
                  res.json({msg :'Data saved successfully'});
                });
  
      
      console.log('Node.js Environment Timezone:', process.env.TZ);
  /**------------------------------------------------------------------------------------------------- */
  
  };

const createHistory = (req, res) =>{
  let values = [];
  let query = '';
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const group = req.body.selectedGroupCategory
    const updateHistory = req.body.updateHistory;
    // const date = new Date();
    // const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    // const currentDate = STR_TO_DATE(date.toLocaleString('en-US', options), '%m/%d/%Y, %h:%i:%s %p GMT+8');   
    // console.log(currentDate)
    console.log(res.body);
    if(group === 'INSTITUTIONAL'){
        const placeholders = Array(updateHistory.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
        updateHistory.forEach(item => {
        /**Convert the 'Pk_Case' value to an integer or set it to NULL if it's an empty string  */ 
        const iRolls_Cs = !isNaN(item.iRolls_Cs) && item.Rolls_Cs !== '' ? parseInt(item.Rolls_Cs) : null;
        const iPk_Case =  !isNaN(item.Pk_Case) && item.Pk_Case !== '' ? parseInt(item.Pk_Case) : null;  
        const iRolls_Pk = !isNaN(item.Rolls_Pk) && item.Rolls_Pk !== '' ? parseInt(item.Rolls_Pk) : null;
        const iSheets_Roll = !isNaN(item.Sheets_Roll) && item.Sheets_Roll !== '' ? parseInt(item.Sheets_Roll) : null;
        const iPly = !isNaN(item.Ply) && item.Ply !== '' ? parseInt(item.Ply) : null;
        const iDIST_05_VAT_EX_CASE = !isNaN(item.DIST_05_VAT_EX_CASE) && item.DIST_05_VAT_EX_CASE !== '' ? parseFloat( item.DIST_05_VAT_EX_CASE) : null;
        const iDIST_05_VAT_EX_UNIT =!isNaN(item.DIST_05_VAT_EX_UNIT) && item.DIST_05_VAT_EX_UNIT !== '' ? parseFloat(item.DIST_05_VAT_EX_UNIT) : null;
        const iDIST_04_VAT_IN_CASE = !isNaN(item.DIST_04_VAT_IN_CASE) && item.DIST_04_VAT_IN_CASE !== '' ? parseFloat(item.DIST_04_VAT_IN_CASE) : null;
        const iDIST_04_VAT_IN_UNIT = !isNaN(item.DIST_04_VAT_IN_UNIT) && item.DIST_04_VAT_IN_UNIT !== '' ? parseFloat(item.DIST_04_VAT_IN_UNIT) : null;
        const iDEAL_05_VAT_EX_CASE = !isNaN(item.DEAL_05_VAT_EX_CASE) && item.DEAL_05_VAT_EX_CASE !== '' ? parseFloat(item.DEAL_05_VAT_EX_CASE) : null;
        const iDEAL_05_VAT_EX_UNIT =  !isNaN(item.DEAL_05_VAT_EX_UNIT) && item.DEAL_05_VAT_EX_UNIT !== '' ? parseFloat(item.DEAL_05_VAT_EX_UNIT,) : null;
        const iDEAL_04_VAT_IN_CASE = !isNaN(item.DEAL_04_VAT_IN_CASE) && item.DEAL_04_VAT_IN_CASE !== '' ? parseFloat( item.DEAL_04_VAT_IN_CASE) : null;
        const iDEAL_04_VAT_IN_UNIT =  !isNaN(item.DEAL_04_VAT_IN_UNIT) && item.DEAL_04_VAT_IN_UNIT !== '' ? parseFloat( item.DEAL_04_VAT_IN_UNIT) : null;
        const iENDU_05_VAT_EX_CASE = !isNaN(item.ENDU_05_VAT_EX_CASE) && item.ENDU_05_VAT_EX_CASE !== '' ? parseFloat(item.ENDU_05_VAT_EX_CASE) : null;
        const iENDU_05_VAT_EX_UNIT = !isNaN(item.ENDU_05_VAT_EX_UNIT) && item.ENDU_05_VAT_EX_UNIT !== '' ? parseFloat(item.ENDU_05_VAT_EX_UNIT) : null;
        const iENDU_04_VAT_IN_CASE = !isNaN(item.ENDU_04_VAT_IN_CASE) && item.ENDU_04_VAT_IN_CASE !== '' ? parseFloat(item.ENDU_04_VAT_IN_CASE) : null;
        const iENDU_04_VAT_IN_UNIT= !isNaN(item.ENDU_04_VAT_IN_UNIT) && item.ENDU_04_VAT_IN_UNIT !== '' ? parseFloat(item.ENDU_04_VAT_IN_UNIT) : null;

        const iprevious_DIST_05_VAT_EX_CASE = !isNaN(item.previous_DIST_05_VAT_EX_CASE) && item.previous_DIST_05_VAT_EX_CASE !== '' ? parseFloat( item.previous_DIST_05_VAT_EX_CASE) : null;
        const iprevious_DIST_05_VAT_EX_UNIT =!isNaN(item.previous_DIST_05_VAT_EX_UNIT) && item.previous_DIST_05_VAT_EX_UNIT !== '' ? parseFloat(item.previous_DIST_05_VAT_EX_UNIT) : null;
        const iprevious_DIST_04_VAT_IN_CASE = !isNaN(item.previous_DIST_04_VAT_IN_CASE) && item.previous_DIST_04_VAT_IN_CASE !== '' ? parseFloat(item.previous_DIST_04_VAT_IN_CASE) : null;
        const iprevious_DIST_04_VAT_IN_UNIT = !isNaN(item.previous_DIST_04_VAT_IN_UNIT) && item.previous_DIST_04_VAT_IN_UNIT !== '' ? parseFloat(item.previous_DIST_04_VAT_IN_UNIT) : null;
        const iprevious_DEAL_05_VAT_EX_CASE = !isNaN(item.previous_DEAL_05_VAT_EX_CASE) && item.previous_DEAL_05_VAT_EX_CASE !== '' ? parseFloat(item.previous_DEAL_05_VAT_EX_CASE) : null;
        const iprevious_DEAL_05_VAT_EX_UNIT =  !isNaN(item.previous_DEAL_05_VAT_EX_UNIT) && item.previous_DEAL_05_VAT_EX_UNIT !== '' ? parseFloat(item.previous_DEAL_05_VAT_EX_UNIT,) : null;
        const iprevious_DEAL_04_VAT_IN_CASE = !isNaN(item.previous_DEAL_04_VAT_IN_CASE) && item.previous_DEAL_04_VAT_IN_CASE !== '' ? parseFloat( item.previous_DEAL_04_VAT_IN_CASE) : null;
        const iprevious_DEAL_04_VAT_IN_UNIT =  !isNaN(item.previous_DEAL_04_VAT_IN_UNIT) && item.previous_DEAL_04_VAT_IN_UNIT !== '' ? parseFloat( item.previous_DEAL_04_VAT_IN_UNIT) : null;
        const iprevious_ENDU_05_VAT_EX_CASE = !isNaN(item.previous_ENDU_05_VAT_EX_CASE) && item.previous_ENDU_05_VAT_EX_CASE !== '' ? parseFloat(item.previous_ENDU_05_VAT_EX_CASE) : null;
        const iprevious_ENDU_05_VAT_EX_UNIT = !isNaN(item.previous_ENDU_05_VAT_EX_UNIT) && item.previous_ENDU_05_VAT_EX_UNIT !== '' ? parseFloat(item.previous_ENDU_05_VAT_EX_UNIT) : null;
        const iprevious_ENDU_04_VAT_IN_CASE = !isNaN(item.previous_ENDU_04_VAT_IN_CASE) && item.previous_ENDU_04_VAT_IN_CASE !== '' ? parseFloat(item.previous_ENDU_04_VAT_IN_CASE) : null;
        const iprevious_ENDU_04_VAT_IN_UNIT= !isNaN(item.previous_ENDU_04_VAT_IN_UNIT) && item.previous_ENDU_04_VAT_IN_UNIT !== '' ? parseFloat(item.previous_ENDU_04_VAT_IN_UNIT) : null;
        

        values.push(item.Business_solutions, item.Product_Category, item.Product_unique_key, item.Product_Code, item.Item_Name, 
            item.Config, item.Size, item.Color, item.Style, item.UM, item.Product_Description, item.Grade, iRolls_Cs, iPk_Case, 
            iRolls_Pk, iSheets_Roll, iPly, item.Standard_weight, iDIST_05_VAT_EX_CASE, iDIST_05_VAT_EX_UNIT, iDIST_04_VAT_IN_CASE, iDIST_04_VAT_IN_UNIT, 
            iDEAL_05_VAT_EX_CASE, iDEAL_05_VAT_EX_UNIT, iDEAL_04_VAT_IN_CASE, iDEAL_04_VAT_IN_UNIT, iENDU_05_VAT_EX_CASE, 
            iENDU_05_VAT_EX_UNIT, iENDU_04_VAT_IN_CASE, iENDU_04_VAT_IN_UNIT, iprevious_DIST_05_VAT_EX_CASE,
            iprevious_DIST_05_VAT_EX_UNIT, iprevious_DIST_04_VAT_IN_CASE, iprevious_DIST_04_VAT_IN_UNIT,
            iprevious_DEAL_05_VAT_EX_CASE, iprevious_DEAL_05_VAT_EX_UNIT, iprevious_DEAL_04_VAT_IN_CASE,
            iprevious_DEAL_04_VAT_IN_UNIT, iprevious_ENDU_05_VAT_EX_CASE, iprevious_ENDU_05_VAT_EX_UNIT,
            iprevious_ENDU_04_VAT_IN_CASE, iprevious_ENDU_04_VAT_IN_UNIT);
        });
        
            query = `INSERT INTO ayh_institutional_update_history (Business_solutions, Product_Category, Product_unique_key, Product_Code, Item_Name, Config, Size, Color,
            Style, UM, Product_Description, Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight, DIST_05_VAT_EX_CASE, DIST_05_VAT_EX_UNIT,
            DIST_04_VAT_IN_CASE, DIST_04_VAT_IN_UNIT, DEAL_05_VAT_EX_CASE, DEAL_05_VAT_EX_UNIT, DEAL_04_VAT_IN_CASE, DEAL_04_VAT_IN_UNIT,
            ENDU_05_VAT_EX_CASE, ENDU_05_VAT_EX_UNIT, ENDU_04_VAT_IN_CASE, ENDU_04_VAT_IN_UNIT, Previous_DIST_05_VAT_EX_CASE, Previous_DIST_05_VAT_EX_UNIT,
            Previous_DIST_04_VAT_IN_CASE, Previous_DIST_04_VAT_IN_UNIT, Previous_DEAL_05_VAT_EX_CASE, Previous_DEAL_05_VAT_EX_UNIT, Previous_DEAL_04_VAT_IN_CASE, 
            Previous_DEAL_04_VAT_IN_UNIT, Previous_ENDU_05_VAT_EX_CASE, Previous_ENDU_05_VAT_EX_UNIT, Previous_ENDU_04_VAT_IN_CASE, Previous_ENDU_04_VAT_IN_UNIT, Created_at, Updated_at
            ) VALUES ${placeholders}`;
        };

        /**Create update history for price group */
        if(group === 'PRICE_GROUP'){
            const placeholders = Array(updateHistory.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
            updateHistory.forEach(item => {
            /**Convert the 'Pk_Case' value to an integer or set it to NULL if it's an empty string  */ 
            const iRolls_Cs = !isNaN(item.iRolls_Cs) && item.Rolls_Cs !== '' ? parseInt(item.Rolls_Cs) : null;
            const iPk_Case =  !isNaN(item.Pk_Case) && item.Pk_Case !== '' ? parseInt(item.Pk_Case) : null;
            const iRolls_Pk = !isNaN(item.Rolls_Pk) && item.Rolls_Pk !== '' ? parseInt(item.Rolls_Pk) : null;
            const iSheets_Roll = !isNaN(item.Sheets_Roll) && item.Sheets_Roll !== '' ? parseInt(item.Sheets_Roll) : null;
            const iPly = !isNaN(item.Ply) && item.Ply !== '' ? parseInt(item.Ply) : null;
            const iPrice_case = !isNaN(item.Price_case) && item.Price_case !== '' ? parseFloat( item.Price_case) : null;
            const iPrice_unit =!isNaN(item.Price_unit) && item.Price_unit !== '' ? parseFloat(item.Price_unit) : null;
            const iprevious_Price_case =!isNaN(item.previous_Price_case) && item.previous_Price_case !== '' ? parseFloat(item.previous_Price_case) : null;
            const iprevious_Price_unit =!isNaN(item.previous_Price_unit) && item.previous_Price_unit !== '' ? parseFloat(item.previous_Price_unit) : null;
         
            
    
            values.push(item.ACCOUNTRELATION, item.unique_key, item.Product_Code, item.Item_Name, 
                item.Config, item.Size, item.Color, item.Style, item.UM, item.Product_Description, item.Grade, iRolls_Cs, iPk_Case, 
                iRolls_Pk, iSheets_Roll, iPly, item.Standard_weight,iPrice_case, iPrice_unit, iprevious_Price_case, iprevious_Price_unit);
            });
            
                query = `INSERT INTO ayh_price_group_history (ACCOUNTRELATION, unique_key, Product_Code, Item_Name, Config, Size, Color,
                Style, UM, Product_Description, Grade, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply, Standard_weight, Price_case, Price_unit,
                Previous_Price_case, Previous_Price_unit, Created_at, Updated_at
                ) VALUES ${placeholders}`;
            };

            if(group === 'BRANDED'){
                const placeholders = Array(updateHistory.length).fill('(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())').join(', ');
                updateHistory.forEach(item => {
                /**Convert the 'Pk_Case' value to an integer or set it to NULL if it's an empty string  */ 
                const iRolls_Cs = !isNaN(item.Rolls_Cs) && item.Rolls_Cs !== '' ? parseInt(item.Rolls_Cs) : null;
                const iPk_Case =  !isNaN(item.Pk_Case) && item.Pk_Case !== '' ? parseInt(item.Pk_Case) : null;
                const iRolls_Pk = !isNaN(item.Rolls_Pk) && item.Rolls_Pk !== '' ? parseInt(item.Rolls_Pk) : null;
                const iSheets_Roll = !isNaN(item.Sheets_Roll) && item.Sheets_Roll !== '' ? parseInt(item.Sheets_Roll) : null;
                const iPly = !isNaN(item.Ply) && item.Ply !== '' ? parseInt(item.Ply) : null;
                const iVATex = !isNaN(item.VATex) && item.VATex !== '' ? parseFloat( item.VATex) : null;
                const iDistributor_Price =!isNaN(item.Distributor_Price) && item.Distributor_Price !== '' ? parseFloat(item.Distributor_Price) : null;
                const iDP_Unit = !isNaN(item.DP_Unit) && item.DP_Unit !== '' ? parseFloat(item.DP_Unit) : null;
                const iMargin = !isNaN(item.Margin) && item.Margin !== '' ? parseFloat(item.Margin) : null;
                const iList_Price_Value = !isNaN(item.List_Price_Value) && item.List_Price_Value !== '' ? parseFloat(item.List_Price_Value) : null;
                const iLP_Unit =  !isNaN(item.LP_Unit) && item.LP_Unit !== '' ? parseFloat(item.LP_Unit,) : null;
                const iMarkup = !isNaN(item.Markup) && item.Markup !== '' ? parseFloat( item.Markup) : null;
                const iSRP_Price_Cs =  !isNaN(item.SRP_Price_Cs) && item.SRP_Price_Cs !== '' ? parseFloat( item.SRP_Price_Cs) : null;
                const iSRP = !isNaN(item.SRP) && item.SRP !== '' ? parseFloat(item.SRP) : null;
                
                const iprevious_VATex = !isNaN(item.previous_VATex) && item.previous_VATex !== '' ? parseFloat(item.previous_VATex) : null;
                const iprevious_Distributor_Price = !isNaN(item.previous_Distributor_Price) && item.previous_Distributor_Price !== '' ? parseFloat(item.previous_Distributor_Price) : null;
                const iprevious_DP_Unit= !isNaN(item.previous_DP_Unit) && item.previous_DP_Unit !== '' ? parseFloat(item.previous_DP_Unit) : null;
                const iprevious_Margin = !isNaN(item.previous_Margin) && item.previous_Margin !== '' ? parseFloat( item.previous_Margin) : null;
                const iprevious_List_Price_Value =!isNaN(item.previous_List_Price_Value) && item.previous_List_Price_Value !== '' ? parseFloat(item.previous_List_Price_Value) : null;
                const iprevious_LP_Unit = !isNaN(item.previous_LP_Unit) && item.previous_LP_Unit !== '' ? parseFloat(item.previous_LP_Unit) : null;
                const iprevious_Markup = !isNaN(item.previous_Markup) && item.previous_Markup !== '' ? parseFloat(item.previous_Markup) : null;
                const iprevious_SRP_Price_Cs = !isNaN(item.previous_SRP_Price_Cs) && item.previous_SRP_Price_Cs !== '' ? parseFloat(item.previous_SRP_Price_Cs) : null;
                const iprevious_SRP =  !isNaN(item.previous_SRP) && item.previous_SRP !== '' ? parseFloat(item.previous_SRP,) : null;
                
                
        
                values.push(item.Business_solutions, item.Product_Category, item.Product_unique_key, item.Product_Code, item.Item_Name, 
                    item.Config, item.Size, item.Color, item.Style, item.UM, item.Product_Description, item.Grade, item.Bg_Cs, iRolls_Cs, iPk_Case, 
                    iRolls_Pk, iSheets_Roll, iPly, item.Standard_weight, iVATex, item.Distributor_Price, item.DP_Unit, item.Margin, item.List_Price_Value, item.LP_Unit, item.Markup, item.SRP_Price_Cs, item.SRP, 
                    iprevious_VATex, item.previous_Distributor_Price, item.previous_DP_Unit, item.previous_Margin, item.previous_List_Price_Value, item.previous_LP_Unit, item.previous_Markup, 
                    item.previous_SRP_Price_Cs, item.previous_SRP );
                });
                
                    query = `INSERT INTO ayh_branded_history (Business_solutions, Product_Category, Product_unique_key, Product_Code, Item_Name, Config, Size, Color, Style, 
                        UM, Product_Description, Grade, Bg_Cs, Rolls_Cs, Pk_Case, Rolls_Pk, Sheets_Roll, Ply,Standard_weight, VATex, Distributor_Price, DP_Unit,
                        Margin, List_Price_Value, LP_Unit, Markup, SRP_Price_Cs, SRP, previous_VATex, previous_Distributor_Price, previous_DP_Unit,
                        previous_Margin, previous_List_Price_Value, previous_LP_Unit, previous_Markup, previous_SRP_Price_Cs, previous_SRP, Created_at, Updated_at
                    ) VALUES ${placeholders}`;
                }

        console.log('Generated SQL query:', values);
        connection.query(query, values, (error, results) => {
        if (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Error saving data');
        } else {
        console.log('Data saved successfully!');
        res.status(200).send('Data saved successfully');
        }
    });
  


};
 /**Update products */
 const updateProducts = (req, res) =>{
  const id = req.params.id;
    const {updatedRecord, selectedGroupCategory, selectedProductCategory, selectedSolution, selectedCustomer} = req.body
    console.log('iupdates satisfies',req.body)

  let query = '';
  let updatedColumns = [];

    if(selectedGroupCategory === 'INSTITUTIONAL'){
        const {
            Business_solutions,
            Product_Category,
            Product_Code,
            Product_unique_key,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Grade,
            Rolls_Cs,
            Pk_Case,
            Rolls_Pk,
            Sheets_Roll,
            Ply,
            Standard_weight,
            Product_Description,
            DIST_05_VAT_EX_CASE,
            DIST_05_VAT_EX_UNIT,
            DIST_04_VAT_IN_CASE,
            DIST_04_VAT_IN_UNIT,
            DEAL_05_VAT_EX_CASE,
            DEAL_05_VAT_EX_UNIT,
            DEAL_04_VAT_IN_CASE,
            DEAL_04_VAT_IN_UNIT,
            ENDU_05_VAT_EX_CASE,
            ENDU_05_VAT_EX_UNIT,
            ENDU_04_VAT_IN_CASE,
            ENDU_04_VAT_IN_UNIT,
            Updated_at
        } = updatedRecord;
            const iRolls_Cs = !isNaN(Rolls_Cs) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
            const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
            const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
            const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
            const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
        // Update the specific columns in MySQL based on the provided ID
         query = 'UPDATE ayh_institutional SET ? WHERE id = ?';
         updatedColumns = {
            Business_solutions,
            Product_Category,
            Product_unique_key,
            Product_Code,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Grade,
            Rolls_Cs : iRolls_Cs,
            Pk_Case : iPk_Case,
            Rolls_Pk: iRolls_Pk,
            Sheets_Roll : iSheets_Roll,
            Ply : iPly,
            Standard_weight,
            Product_Description,
            DIST_05_VAT_EX_CASE,
            DIST_05_VAT_EX_UNIT,
            DIST_04_VAT_IN_CASE,
            DIST_04_VAT_IN_UNIT,
            DEAL_05_VAT_EX_CASE,
            DEAL_05_VAT_EX_UNIT,
            DEAL_04_VAT_IN_CASE,
            DEAL_04_VAT_IN_UNIT,
            ENDU_05_VAT_EX_CASE,
            ENDU_05_VAT_EX_UNIT,
            ENDU_04_VAT_IN_CASE,
            ENDU_04_VAT_IN_UNIT,
            Updated_at: new Date() // Set the Updated_at to the current date and time
        };
        Object.keys(updatedColumns).forEach(key => {
            if (updatedColumns[key] === '') {
                updatedColumns[key] = null;
            }
        });
    }
    /**Updating products under price group */
    if(selectedGroupCategory === 'PRICE_GROUP'){
        const {
            ACCOUNTRELATION,
            unique_key,
            Product_Code,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Product_Description,
            Grade,
            Rolls_Cs,
            Pk_Case,
            Rolls_Pk,
            Sheets_Roll,
            Ply,
            Standard_weight,
            Price_case,
            Price_unit,
            Updated_at
        } = updatedRecord;

        // Function to check and convert empty strings to null
        const convertToNull = (value) => {
            return isNaN(value) || value === '' ? null : parseInt(value);
        };

        // Convert empty strings to null for specific columns
        const updatedRolls_Cs = convertToNull(Rolls_Cs);
        const updatedPk_Case = convertToNull(Pk_Case);
        const updatedRolls_Pk = convertToNull(Rolls_Pk);
        const updatedSheets_Roll = convertToNull(Sheets_Roll);
        const updatedPly = convertToNull(Ply);
        const updatedPrice_case = convertToNull(Price_case);
        const updatedPrice_unit = convertToNull(Price_unit);
        const iRolls_Cs = !isNaN(Pk_Case) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
        const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
        const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
        const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
        const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
        const iPrice_case = !isNaN(Price_case) && Price_case !== '' ? parseFloat( Price_case) : null;
        const iPrice_unit =!isNaN(Price_unit) && Price_unit !== '' ? parseFloat(Price_unit) : null;
    
        // Update the specific columns in MySQL based on the provided ID
        query = 'UPDATE ayh_price_group SET ? WHERE id = ?';
        // Create the updatedColumns object with the modified values
        updatedColumns = {
            ACCOUNTRELATION,
            unique_key,
            Product_Code,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Product_Description,
            Grade,
            Rolls_Cs: iRolls_Cs,
            Pk_Case: iPk_Case,
            Rolls_Pk: iRolls_Pk,
            Sheets_Roll: iSheets_Roll,
            Ply: iPly,
            Standard_weight,
            Price_case : iPrice_case,
            Price_unit :iPrice_unit,
            Updated_at: new Date() // Set the Updated_at to the current date and time
        };

    };

    /** update for branded */

    if(selectedGroupCategory === 'BRANDED'){
        const {
            Business_solutions,
            Product_Category,
            Product_unique_key,
            Product_Code,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Product_Description,
            Grade,
            Rolls_Cs,
            Pk_Case,
            Rolls_Pk,
            Sheets_Roll,
            Ply,
            Standard_weight,
            VATex,
            Distributor_Price,
            DP_Unit,
            Margin,
            List_Price_Value,
            LP_Unit,
            Markup,
            SRP_Price_Cs,
            SRP,
            Updated_at
        } = updatedRecord;

        // Function to check and convert empty strings to null
        const convertToNull = (value) => {
            return isNaN(value) || value === '' ? null : parseInt(value);
        };

        // Convert empty strings to null for specific columns
     
            const iRolls_Cs = !isNaN(Rolls_Cs) && Rolls_Cs !== '' ? parseInt(Rolls_Cs) : null;
            const iPk_Case =  !isNaN(Pk_Case) && Pk_Case !== '' ? parseInt(Pk_Case) : null;
            const iRolls_Pk = !isNaN(Rolls_Pk) && Rolls_Pk !== '' ? parseInt(Rolls_Pk) : null;
            const iSheets_Roll = !isNaN(Sheets_Roll) && Sheets_Roll !== '' ? parseInt(Sheets_Roll) : null;
            const iPly = !isNaN(Ply) && Ply !== '' ? parseInt(Ply) : null;
            const iVATex = !isNaN(VATex) && VATex !== '' ? parseFloat( VATex) : null;
            const iDistributor_Price =!isNaN(Distributor_Price) && Distributor_Price !== '' ? parseFloat(Distributor_Price) : null;
            const iDP_Unit = !isNaN(DP_Unit) && DP_Unit !== '' ? parseFloat(DP_Unit) : null;
            const iMargin = !isNaN(Margin) && Margin !== '' ? parseFloat(Margin) : null;
            const iList_Price_Value = !isNaN(List_Price_Value) && List_Price_Value !== '' ? parseFloat(List_Price_Value) : null;
            const iLP_Unit =  !isNaN(LP_Unit) && LP_Unit !== '' ? parseFloat(LP_Unit,) : null;
            const iMarkup = !isNaN(Markup) && Markup !== '' ? parseFloat( Markup) : null;
            const iSRP_Price_Cs =  !isNaN(SRP_Price_Cs) && SRP_Price_Cs !== '' ? parseFloat( SRP_Price_Cs) : null;
            const iSRP = !isNaN(SRP) && SRP !== '' ? parseFloat(SRP) : null;
    
        // Update the specific columns in MySQL based on the provided ID
        query = 'UPDATE ayh_branded SET ? WHERE id = ?';
        // Create the updatedColumns object with the modified values
        updatedColumns = {
            Business_solutions,
            Product_Category,
            Product_unique_key,
            Product_Code,
            Item_Name,
            Config,
            Size,
            Color,
            Style,
            UM,
            Grade,
            Product_Description,
            Rolls_Cs: iRolls_Cs,
            Pk_Case: iPk_Case,
            Rolls_Pk: iRolls_Pk,
            Sheets_Roll: iSheets_Roll,
            Ply: iPly,
            Standard_weight,
            VATex : iVATex,
            Distributor_Price : iDistributor_Price,
            DP_Unit : iDP_Unit,
            Margin : iMargin,
            List_Price_Value : iList_Price_Value,
            LP_Unit : iLP_Unit,
            Markup : iMarkup,
            SRP_Price_Cs : iSRP_Price_Cs,
            SRP : iSRP,
            Updated_at: new Date() // Set the Updated_at to the current date and time
        };

    }
  connection.query(query, [updatedColumns, id], (err, result) => {
    if (err) {
      console.error(`Error updating data with ID ${id} in MySQL:`, err);
      res.status(500).json({ error: `Error updating data with ID ${id}` });
    } else {
      console.log(`Data with ID ${id} updated successfully in MySQL!`);
    //   res.status(200).json({ message: `Data with ID ${id} updated successfully!` });
    }
  });   
  let selectQuery = '';
        if(selectedGroupCategory === 'INSTITUTIONAL') {
       
            if(selectedProductCategory !== '' && selectedSolution !== ''){
                selectQuery = `SELECT * FROM ayh_institutional WHERE Business_solutions = '${selectedSolution}' AND Product_Category = '${selectedProductCategory}';`;
            }else{
                selectQuery = `SELECT * FROM ayh_institutional;`;
            }
            
            connection.query(selectQuery, (err, result) => {
                if (err) {
                    console.error('Error fetching data ', err);
                    res.status(500).send('Fetching data Failed');
                } else {
                    // console.log('Data successfully Retrieved');
                    // console.log('result ', result);
                    res.status(200).json(result); // Sending the result as JSON response
                }
            });

        }else if (selectedGroupCategory === 'PRICE_GROUP'){
            const results = []; // Array to store the results for each customer

            for (const customer of selectedCustomer) {
              const selectQuery = `SELECT * FROM ayh_price_group WHERE ACCOUNTRELATION = '${selectedCustomer}';`;
              connection.query(selectQuery, (err, result) => {
                if (err) {
                  console.error(`Error fetching data for customer ${customer}:`, err);
                } else {
                  // Push the results to the 'results' array
                  results.push(...result);
            
                  // If all queries are done (results for all customers fetched), send the response
                //   if (results.length === selectedCustomer.length) {
                //     
                //   }
                }
              });
            }
            res.status(200).json(results);
            /**Fetch updated branded record */
        }else if(selectedGroupCategory === 'BRANDED') {
       
            if(selectedProductCategory !== '' && selectedSolution !== ''){
                selectQuery = `SELECT * FROM ayh_branded WHERE Business_solutions = '${selectedSolution}' AND Product_Category = '${selectedProductCategory}';`;
            }else{
                selectQuery = `SELECT * FROM ayh_branded;`;
            }
            
            connection.query(selectQuery, (err, result) => {
                if (err) {
                    console.error('Error fetching data ', err);
                    res.status(500).send('Fetching data Failed');
                } else {
                    // console.log('Data successfully Retrieved');
                    // console.log('result ', result);
                    res.status(200).json(result); // Sending the result as JSON response
                }
            });

        }
        
    
    //  connection.query(selectQuery, (err, result) => {
    //      if (err) {
    //          console.error('Error fetching data ', err);
    //          res.status(500).send('Fetching data Failed');
    //      } else {
    //          // console.log('Data successfully Retrieved');
    //          // console.log('result ', result);
    //          res.status(200).json(result); // Sending the result as JSON response
    //      }
    //  });
 };

 /**Delete product */
const deleteRecord = (req, res) => {
    const idToDelete = req.params.id;
    console.log('Deleted id ', idToDelete);
    console.log(req.body)
    const { category, solution, group, customers } = req.body

   
    let database = '';
    let selectQuery = '';
    
    if (group === 'INSTITUTIONAL') {
        database = 'ayh_institutional';
        selectQuery = `SELECT * FROM ${database}`;
            if (solution !== '' && category !== '') {
                // Use the actual values if they are not null
                selectQuery += ` WHERE Business_solutions = '${solution}' AND Product_Category = '${category}'`;
            }
    } else if (group === 'PRICE_GROUP') {
        database = 'ayh_price_group';
        selectQuery = `SELECT * FROM ${database}`;

        const customersArray = JSON.parse(customers);

        if (customersArray.length > 0) {
            // Use the actual values if they are not empty
            selectQuery += ` WHERE ACCOUNTRELATION IN ('${customersArray.join("', '")}')`;
        }
    } else if (group === 'BRANDED') {
        database = 'ayh_branded';
        selectQuery = `SELECT * FROM ${database}`;
        if (solution !== '' && category !== '') {
            // Use the actual values if they are not null
            selectQuery += ` WHERE Business_solutions = '${solution}' AND Product_Category = '${category}'`;
        }
    }
    
    

    connection.query(`ALTER TABLE ${database} MODIFY COLUMN id INT;`, (error, results) => {
        if (error) {
            console.error('An error occurred while disabling auto-increment:', error);
            res.status(500).send('Error disabling auto-increment');
            return;
        }

        console.log('Disabled auto-increment for id column.');


        /**  delete the new record to the desired id*/
        const deleterQuery = `DELETE FROM ${database} WHERE id = ?`;
        connection.query(deleterQuery, idToDelete, (error, results) => {
            if (error) {
                console.error('An error occurred while inserting the record:', error);
                return;
            }
            /** Update the id values greater than afterId to make space for the new record*/
            const updateQuery = `UPDATE ${database} SET id = id - 1 WHERE id >= ${idToDelete} ORDER BY id ASC`;
            connection.query(updateQuery, (error, results) => {
                if (error) {
                    console.error('An error occurred while updating the id values:', error);
                    return;
                }

                /**  Set the auto-increment back on the id column  */

                connection.query(`ALTER TABLE ${database} MODIFY COLUMN id INT AUTO_INCREMENT;`, (error, results) => {
                    if (error) {
                        console.error('An error occurred while setting auto-increment back:', error);
                        res.status(500).send('Error enabling auto-increment');
                    } else {
                        console.log('Auto-increment set back on id column.');
                        // res.status(200).send('Data deleted successfully');
                    }
                });
                // const selectQuery = `SELECT * FROM ayh_institutional WHERE Business_solutions = '${solution}' AND Product_Category = '${category}';`;
                connection.query(selectQuery, (err, result) => {
                    if (err) {
                        console.error('Error fetching data ', err);
                        res.status(500).send('Fetching data Failed');
                    } else {
                        // console.log('Data successfully Retrieved');
                        // console.log('result ', result);
                        res.status(200).json(result); // Sending the result as JSON response
                    }
                });
            });
        });
    });
    console.log('Node.js Environment Timezone:', process.env.TZ);
};
    /** Generate STA */
const generateSTA = async (req, res) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const categoryGroup = req.query.categoryGroup;

    console.log(categoryGroup);
    console.log(startDate)
    console.log(endDate)
    let database = '';
    if (categoryGroup === 'INSTITUTIONAL') {
        database = 'ayh_institutional';
    } else if (categoryGroup === 'PRICE_GROUP') {
        database = 'ayh_price_group';
    } else if (categoryGroup === 'BRANDED') {
        database = 'ayh_branded';
    }

    try {
        // const selectQuery = `SELECT * FROM ${database} WHERE Effectivity_date_start = '${startDate}' AND Effectivity_date_end = '${endDate}';`;
        const selectQuery = `SELECT * FROM ${database} ;`;

        /**intitutional */
        if(categoryGroup === 'INSTITUTIONAL'){
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    if (results.length > 0) {
                        /**  Use the map method to process each row and create an array of objects */
                        let processedLineNum = 1;
                        let exemptionLineNum = 1;
                        const processedData = [];
                        const exemption = [];

                        results.map((row, index) => {
                            const data = {
                                // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'DEAL04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.DEAL_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        results.map((row, index) => {
                            const data = {
                                //  STA_Unique_Code: 'DEAL05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'DEAL05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.DEAL_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        results.map((row, index) => {
                            const data = {
                                //  STA_Unique_Code: 'DIST04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'DIST04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.DIST_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        results.map((row, index) => {
                            const data = {
                                //  STA_Unique_Code: 'DIST05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'DIST05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.DIST_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        results.map((row, index) => {
                            const data = {
                                //  STA_Unique_Code: 'ENDU04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'ENDU04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.ENDU_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        results.map((row, index) => {
                            const data = {
                                //  STA_Unique_Code: 'ENDU05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'ENDU05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.ENDU_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });

                        // Send the processed data to the frontend
                        res.json(processedData);
                    } else {
                        res.json({ error: 'No record found' });
                        console.log('No record found');
                        console.log(selectQuery)
                    };

                }
            });
        };
        /**Generate STA for price group */
        if(categoryGroup === 'PRICE_GROUP'){
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    if (results.length > 0) {
                        /**  Use the map method to process each row and create an array of objects */
                        let processedLineNum = 1;
                        let exemptionLineNum = 1;
                        const processedData = [];
                        const exemption = [];

                        results.map((row, index) => {
                            
                            const data = {
                                // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: row.ACCOUNTRELATION, ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.Price_case, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });
                        // Send the processed data to the frontend
                        res.json(processedData);
                    } else {
                        res.json({ error: 'No record found' });
                        console.log('No record found');
                        console.log(selectQuery)
                    };

                }
            });
        };

        /**Generate STA for Branded */
        /**intitutional */
        if(categoryGroup === 'BRANDED'){
            connection.query(selectQuery, (error, results) => {
                if (error) {
                    console.error('Error fetching products:', error);
                    res.status(500).json({ error: 'Failed to fetch products' });
                } else {
                    if (results.length > 0) {
                        /**  Use the map method to process each row and create an array of objects */
                        let processedLineNum = 1;
                        let exemptionLineNum = 1;
                        const processedData = [];
                        const exemption = [];

                        results.map((row, index) => {
                            const data = {
                                // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'BRDSRP', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.SRP_Price_Cs, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });

                        results.map((row, index) => {
                            const data = {
                                // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'BRDLST', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.List_Price_Value, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });

                        results.map((row, index) => {
                            const data = {
                                // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                AccountCode: 'Group', AccountRelation: 'BRDDST', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                Amount: row.Distributor_Price, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                            };

                            row.Product_Code ? processedData.push(data) : exemption.push(data);
                        });

                        // Send the processed data to the frontend
                        res.json(processedData);
                    } else {
                        res.json({ error: 'No record found' });
                        console.log('No record found');
                        console.log(selectQuery)
                    };

                }
            });
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
    /**Generate STA changes */
const getSTAChanges = async (req, res) => {
    const categoryGroup = req.query.categoryGroup;
    const lastDownloadSTAChangesInst = new Date(req.query.lastDownloadSTAChangesInst);
    const lastDownloadSTAChangesPg = new Date (req.query.lastDownloadSTAChangesPg);
    const lastDownloadSTAChangesBranded = new Date(req.query.lastDownloadSTAChangesBranded);
    let lastDownloadSTAChanges  = '';

    const currentDate = new Date(req.query.currentDate);
    const startDate = new Date (req.query.startDate);
    const endDate = new Date(req.query.endDate);
    

    let database = '';
   if (categoryGroup === 'INSTITUTIONAL') {
        database = 'ayh_institutional';
        lastDownloadSTAChanges = lastDownloadSTAChangesInst;
    }else if (categoryGroup === 'PRICE_GROUP') {
        database = 'ayh_price_group';
        lastDownloadSTAChanges = lastDownloadSTAChangesPg;
    }else if (categoryGroup === 'BRANDED') {
        database = 'ayh_branded';
        lastDownloadSTAChanges = lastDownloadSTAChangesBranded;
    }
    const formattedLastDownloadDate = `${lastDownloadSTAChanges.getFullYear()}-${(lastDownloadSTAChanges.getMonth() + 1).toString().padStart(2, '0')}-${lastDownloadSTAChanges.getDate().toString().padStart(2, '0')} ${lastDownloadSTAChanges.getHours().toString().padStart(2, '0')}:${lastDownloadSTAChanges.getMinutes().toString().padStart(2, '0')}:${lastDownloadSTAChanges.getSeconds().toString().padStart(2, '0')}`;
    const formattedcurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;
    console.log(req.query)
    try {
            const selectQuery = `SELECT * FROM ${database} WHERE Created_at BETWEEN '${formattedLastDownloadDate}' AND '${formattedcurrentDate}' OR  Updated_at BETWEEN '${formattedLastDownloadDate}' AND '${formattedcurrentDate}';`;
            if(categoryGroup === 'INSTITUTIONAL'){
                connection.query(selectQuery, (error, results) => {
                    if (error) {
                        console.error('Error fetching products:', error);
                        res.status(500).json({ error: 'Failed to fetch products' });
                    } else {
                        if(results.length > 0){
                           
                                /**  Use the map method to process each row and create an array of objects */
                                let processedLineNum = 1;
                                let exemptionLineNum = 1;
                                const processedData = [];
                                const exemption = [];
        
                                results.map((row, index) => {
                                const data = {
                                        STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'DEAL04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.DEAL_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                results.map((row, index) => {
                                    const data = {
                                        STA_Unique_Code: 'DEAL05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'DEAL05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.DEAL_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                results.map((row, index) => {
                                    const data = {
                                        STA_Unique_Code: 'DIST04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'DIST04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.DIST_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                results.map((row, index) => {
                                    const data = {
                                        STA_Unique_Code: 'DIST05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'DIST05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.DIST_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                results.map((row, index) => {
                                    const data = {
                                        STA_Unique_Code: 'ENDU04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'ENDU04', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.ENDU_04_VAT_IN_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                results.map((row, index) => {
                                    const data = {
                                        STA_Unique_Code: 'ENDU05'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'ENDU05', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.ENDU_05_VAT_EX_CASE, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.UM, InventSiteId: '', FromDate: startDate ,ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                
                                // Send the processed data to the frontend
                                res.json(processedData);
                          
                        }else{
                            res.json({error: `No changes made since ${formattedLastDownloadDate}` });

                        }  
                    }
                });
            }
            if(categoryGroup === 'PRICE_GROUP'){
                connection.query(selectQuery, (error, results) => {
                    if (error) {
                        console.error('Error fetching products:', error);
                        res.status(500).json({ error: 'Failed to fetch products' });
                    } else {
                        if (results.length > 0) {
                            /**  Use the map method to process each row and create an array of objects */
                            let processedLineNum = 1;
                            let exemptionLineNum = 1;
                            const processedData = [];
                            const exemption = [];
    
                            results.map((row, index) => {
                                const data = {
                                    // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                    JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                    AccountCode: 'Group', AccountRelation: row.ACCOUNTRELATION, ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                    InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                    Amount: row.Price_case, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                    UnitId: row.UM, InventSiteId: '', FromDate: startDate, ToDate: endDate
                                };
    
                                row.Product_Code ? processedData.push(data) : exemption.push(data);
                            });
                            // Send the processed data to the frontend
                            res.json(processedData);
                        } else {
                            res.json({error: `No changes made since ${formattedLastDownloadDate}` });
                           
                        };
    
                    }
                });
            }
            /**Get STA Changes for Branden */
            if(categoryGroup === 'BRANDED'){
                connection.query(selectQuery, (error, results) => {
                    if (error) {
                        console.error('Error fetching products:', error);
                        res.status(500).json({ error: 'Failed to fetch products' });
                    } else {
                        if(results.length > 0){
                           
                                /**  Use the map method to process each row and create an array of objects */
                                let processedLineNum = 1;
                                let exemptionLineNum = 1;
                                const processedData = [];
                                const exemption = [];
        
                                results.map((row, index) => {
                                    const data = {
                                        // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'SRP_price', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.SRP_Price_Cs, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
        
                                results.map((row, index) => {
                                    const data = {
                                        // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'List_Price_Value', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.List_Price_Value, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
        
                                results.map((row, index) => {
                                    const data = {
                                        // STA_Unique_Code: 'DEAL04'+ row.Product_Code + row.Config +row.Size + row.Color + row.Style, 
                                        JournalName: 'STA', JournalNum: '', relation: 'Price (Sales)', LineNum: row.Product_Code ? processedLineNum++ : exemptionLineNum++,
                                        AccountCode: 'Group', AccountRelation: 'Distributor_Price', ItemRelation: 'Table', Itemcode: row.Product_Code, configId: row.Config,
                                        InventSizeId: row.Size, InventColorId: row.Color, InventStyleId: row.Style, Currency: 'PHP',
                                        Amount: row.Distributor_Price, PRICEUNIT: 1, QuantityAmountFrom: '', QuantityAmountTo: '',
                                        UnitId: row.Bg_Cs, InventSiteId: '', FromDate: startDate, ToDate: endDate
                                    };
        
                                    row.Product_Code ? processedData.push(data) : exemption.push(data);
                                });
                                // Send the processed data to the frontend
                                res.json(processedData);
                          
                        }else{
                            res.json({error: `No changes made since ${formattedLastDownloadDate}` });

                        }  
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }

        /**Get STA change on Branded */
        
    
};
module.exports ={
    getSolandCat,
    getProducts,
    getProduct,
    InsertNewProducts,
    createHistory,
    updateProducts,
    deleteRecord,
    getProductChanges,
    generateSTA,
    getSTAChanges,
    getAXpriceGroup,
    getProductMaster,
    NewProducts
}